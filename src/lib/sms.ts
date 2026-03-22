import type { Order, OrderStatus } from '@/types';

export interface SmsPayload {
  apiKey: string;
  provider: 'netgsm' | 'iletimerkezi';
  phones: string[];
  message: string;
}

export function buildOrderSmsMessage(order: Order, status: OrderStatus): string {
  const statusMessages: Record<OrderStatus, string> = {
    new: `Yeni sipariş alındı! Sipariş No: ${order.orderNumber}`,
    confirmed: `Siparişiniz onaylandı. Sipariş No: ${order.orderNumber}`,
    preparing: `Siparişiniz hazırlanıyor. Sipariş No: ${order.orderNumber}`,
    on_the_way: `Siparişiniz yola çıktı! Sipariş No: ${order.orderNumber}`,
    delivered: `Siparişiniz teslim edildi. Afiyet olsun! Sipariş No: ${order.orderNumber}`,
    rejected: `Siparişiniz iptal edildi. Sipariş No: ${order.orderNumber}. Lütfen bizi arayın.`,
  };
  return statusMessages[status] || '';
}

export async function sendSms(_payload: SmsPayload): Promise<boolean> {
  console.warn('SMS gönderimi sunucu taraflı API gerektirir. WhatsApp alternatifini kullanın.');
  return false;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export function buildOrderWhatsAppMessage(order: Order): string {
  const items = order.items
    .map((i) => `• ${i.name} x${i.quantity} — ${i.price.toFixed(2)} ₺`)
    .join('\n');

  return `🛍️ Sipariş No: ${order.orderNumber}\n\n${items}\n\nToplam: ${order.total.toFixed(2)} ₺\nÖdeme: ${order.paymentMethod === 'cash' ? 'Kapıda Nakit' : 'Kapıda Kart'}`;
}
