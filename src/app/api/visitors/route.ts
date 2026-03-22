import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase/firestore';
import { hashIP } from '@/lib/utils';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId, sessionId, referrer, userAgent, action, duration, pageViews } = body;

    const { getVisitorByIpHash, createVisitor, updateVisitor } = await import(
      '@/lib/firebase/firestore'
    );
    const { getNextVisitorId } = await import('@/lib/firebase/realtime');

    if (action === 'end' && visitorId) {
      const visitor = await getVisitorByIpHash('');
      if (visitor) {
        const sessions = visitor.sessions || [];
        const sessionIndex = sessions.findIndex((s) => s.sessionId === sessionId);
        if (sessionIndex !== -1) {
          sessions[sessionIndex] = {
            ...sessions[sessionIndex],
            endTime: Timestamp.now(),
            duration: duration || 0,
            pageViews: pageViews || 1,
          };
          await updateVisitor(visitor.id, { sessions });
        }
      }
      return NextResponse.json({ ok: true });
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '0.0.0.0';

    const ipHash = await hashIP(ip);
    const existingVisitor = await getVisitorByIpHash(ipHash);

    if (existingVisitor) {
      const newSession = {
        sessionId,
        startTime: Timestamp.now(),
        endTime: Timestamp.now(),
        duration: 0,
        pageViews: 1,
        referrer: referrer || '',
      };

      await updateVisitor(existingVisitor.id, {
        lastVisit: Timestamp.now(),
        totalVisits: (existingVisitor.totalVisits || 0) + 1,
        sessions: [...(existingVisitor.sessions || []), newSession],
        userAgent: userAgent || existingVisitor.userAgent,
      });

      return NextResponse.json({ visitorId: existingVisitor.visitorId });
    }

    const nextId = await getNextVisitorId();
    const newVisitorId = `Visitor_${nextId}`;

    const newVisitorData = {
      visitorId: newVisitorId,
      ip: ipHash,
      userAgent: userAgent || '',
      sessions: [
        {
          sessionId,
          startTime: Timestamp.now(),
          endTime: Timestamp.now(),
          duration: 0,
          pageViews: 1,
          referrer: referrer || '',
        },
      ],
      totalVisits: 1,
      lastVisit: Timestamp.now(),
      cartEvents: [],
      orders: [],
      isBlacklisted: false,
    };

    await createVisitor(newVisitorData);
    return NextResponse.json({ visitorId: newVisitorId });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
