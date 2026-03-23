import type { Product, CartItem } from '@/types';

const POLLINATIONS_URL = 'https://gen.pollinations.ai/v1/chat/completions';

export interface AiCartResponse {
  items: { productId: string; quantity: number }[];
  message?: string;
}

export async function getAiCartSuggestion(
  products: Product[],
  userRequest: string
): Promise<AiCartResponse> {
  const apiKey = process.env.NEXT_PUBLIC_POLLINATIONS_API_KEY;

  const productList = products
    .filter((p) => p.isActive)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.categoryId,
      badges: p.badges,
    }));

  const systemPrompt = `Sen bir restoran sipariş asistanısın. Müşterinin isteğine göre menüden uygun ürünler öneriyorsun.
Menüdeki ürünler: ${JSON.stringify(productList)}
Sadece JSON formatında cevap ver: { "items": [{ "productId": "...", "quantity": 1 }] }
Maksimum 5 farklı ürün öner. Sadece mevcut ürün ID'lerini kullan. Başka metin yazma.`;

  const body = {
    model: 'openai',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userRequest },
    ],
    response_format: { type: 'json_object' },
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const res = await fetch(POLLINATIONS_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });

  if (res.status === 401) {
    throw new Error('AI Sepet için Pollinations API key gerekli. GitHub Secrets\'a NEXT_PUBLIC_POLLINATIONS_API_KEY ekleyin (enter.pollinations.ai).');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || res.statusText || 'AI servisine ulaşılamadı';
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim() || '';

  try {
    const parsed = JSON.parse(text);
    if (parsed.items && Array.isArray(parsed.items)) {
      return parsed as AiCartResponse;
    }
    throw new Error('Geçersiz AI yanıtı');
  } catch {
    throw new Error('AI yanıtı işlenemedi');
  }
}

export function buildAiCartItems(
  suggestion: AiCartResponse,
  products: Product[]
): CartItem[] {
  const productMap = new Map(products.map((p) => [p.id, p]));

  return suggestion.items
    .filter(({ productId }) => productMap.has(productId))
    .map(({ productId, quantity }) => {
      const product = productMap.get(productId)!;
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: Math.max(1, quantity),
        variants: [],
        image: product.images[0] || '',
      } satisfies CartItem;
    });
}
