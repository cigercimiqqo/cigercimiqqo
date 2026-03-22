import { NextRequest, NextResponse } from 'next/server';
import { Timestamp, where } from 'firebase/firestore/lite';
import type { Order } from '@/types';
import { generateOrderNumber, hashIP } from '@/lib/utils';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path } = await context.params;
  const segment = path?.[0] ?? '';

  switch (segment) {
    case 'orders':
      return handleOrders(req);
    case 'visitors':
      return handleVisitors(req);
    case 'ai-cart':
      return handleAiCart(req);
    case 'sms':
      return handleSms(req);
    default:
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

async function handleOrders(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, paymentMethod, note, visitorId, couponCode, discountAmount } = body;

    if (!customer?.name || !customer?.phone || !items?.length) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const total = Math.max(0, subtotal - (discountAmount || 0));

    const { createOrder } = await import('@/lib/firebase/firestore');
    const { setActiveOrder } = await import('@/lib/firebase/realtime');

    const orderData: Omit<Order, 'id'> = {
      orderNumber: generateOrderNumber(),
      status: 'new',
      customer,
      items,
      subtotal,
      total,
      paymentMethod: paymentMethod || 'cash',
      note: note || '',
      visitorId: visitorId || '',
      isBlacklisted: false,
      statusHistory: [
        { status: 'new', timestamp: Timestamp.now(), note: 'Sipariş oluşturuldu' },
      ],
      couponCode: couponCode || '',
      discountAmount: discountAmount || 0,
      createdAt: Timestamp.now(),
    };

    const orderId = await createOrder(orderData);

    await setActiveOrder(orderId, {
      status: 'new',
      updatedAt: Date.now(),
      customerName: customer.name,
    });

    return NextResponse.json({ orderId, orderNumber: orderData.orderNumber });
  } catch {
    return NextResponse.json({ error: 'Sipariş oluşturulamadı' }, { status: 500 });
  }
}

async function handleVisitors(req: NextRequest) {
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

async function handleAiCart(req: NextRequest) {
  try {
    const { userRequest } = await req.json();

    if (!userRequest?.trim()) {
      return NextResponse.json({ error: 'İstek boş olamaz' }, { status: 400 });
    }

    const { getProducts } = await import('@/lib/firebase/firestore');
    const { getAiCartSuggestion } = await import('@/lib/pollinations');

    const products = await getProducts([where('isActive', '==', true)]);

    if (!products.length) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    const suggestion = await getAiCartSuggestion(products, userRequest);
    return NextResponse.json(suggestion);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI servisi hatası';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function handleSms(req: NextRequest) {
  try {
    const { apiKey, provider, phones, message } = await req.json();

    if (!apiKey || !phones?.length || !message) {
      return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 });
    }

    if (provider === 'netgsm') {
      const params = new URLSearchParams({
        usercode: apiKey.split(':')[0] || '',
        password: apiKey.split(':')[1] || '',
        gsmno: phones.join(','),
        message,
        msgtype: '1',
        dil: 'TR',
      });

      const res = await fetch(`https://api.netgsm.com.tr/sms/send/get/?${params}`);
      const text = await res.text();
      if (text.startsWith('00') || text.startsWith('01')) {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ error: 'SMS gönderilemedi', detail: text }, { status: 500 });
    }

    if (provider === 'iletimerkezi') {
      const res = await fetch('https://api.iletimerkezi.com/v1/send-sms/json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request: {
            authentication: { key: apiKey },
            order: {
              sender: 'RESTORAN',
              sendDateTime: '',
              message: { text: message, receipents: { number: phones } },
            },
          },
        }),
      });
      const data = await res.json();
      return NextResponse.json({ ok: true, data });
    }

    return NextResponse.json({ error: 'Bilinmeyen sağlayıcı' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'SMS hatası' }, { status: 500 });
  }
}
