import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center px-4">
      <div>
        <div className="text-8xl mb-6">🍽️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">404</h1>
        <p className="text-gray-500 mb-8">Aradığınız sayfa bulunamadı.</p>
        <Link
          href="/"
          className="inline-flex px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
