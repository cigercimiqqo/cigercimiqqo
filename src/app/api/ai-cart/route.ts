import { NextRequest, NextResponse } from 'next/server';
import { where } from 'firebase/firestore';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
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
