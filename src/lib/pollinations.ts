import type { Product, CartItem } from '@/types';

const POLLINATIONS_URL = 'https://text.pollinations.ai/';

export interface AiCartResponse {
  items: { productId: string; quantity: number }[];
  message?: string;
}

export async function getAiCartSuggestion(
  products: Product[],
  userRequest: string
): Promise<AiCartResponse> {
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
Maksimum 5 farklı ürün öner. Sadece mevcut ürün ID'lerini kullan.`;

  const body = {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userRequest },
    ],
    model: 'openai',
    seed: 42,
    json: true,
  };

  const res = await fetch(POLLINATIONS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error('AI servisine ulaşılamadı');
  }

  const text = await res.text();

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
