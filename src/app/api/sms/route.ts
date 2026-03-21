import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
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
