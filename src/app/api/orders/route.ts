import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase/firestore';
import type { Order } from '@/types';
import { generateOrderNumber } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
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
