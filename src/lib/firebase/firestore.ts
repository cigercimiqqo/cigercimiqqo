import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  writeBatch,
  increment,
  QueryConstraint,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { getDb } from './client';
import type {
  SiteSettings,
  Category,
  Product,
  Order,
  OrderStatus,
  Visitor,
  BlogPost,
  Review,
  DynamicPage,
  Coupon,
} from '@/types';

// ─── Settings ──────────────────────────────────────────────────────────────

const SETTINGS_META_KEY = 'meta';
const SETTINGS_CONFIG_KEY = 'config';

export interface SettingsMeta {
  version: number;
  updatedAt: ReturnType<typeof Date.now>;
}

/** Sadece versiyonu okur – cache karşılaştırması için (1 read) */
export async function getSettingsMeta(): Promise<SettingsMeta | null> {
  const metaRef = doc(getDb(), 'settings', SETTINGS_META_KEY);
  const snap = await getDoc(metaRef);
  if (snap.exists()) {
    const d = snap.data();
    return {
      version: Number(d?.version ?? 0),
      updatedAt: d?.updatedAt?.toMillis?.() ?? 0,
    };
  }
  const configSnap = await getDoc(doc(getDb(), 'settings', SETTINGS_CONFIG_KEY));
  if (configSnap.exists()) {
    await setDoc(metaRef, { version: 1, updatedAt: Timestamp.now() });
    return { version: 1, updatedAt: Date.now() };
  }
  return null;
}

/** Tam ayarları okur */
export async function getSettings(): Promise<(SiteSettings & { _version?: number }) | null> {
  const snap = await getDoc(doc(getDb(), 'settings', SETTINGS_CONFIG_KEY));
  if (!snap.exists()) return null;
  const data = snap.data() as SiteSettings & { _version?: number };
  const meta = await getSettingsMeta();
  if (meta) data._version = meta.version;
  return data;
}

/** Ayarları günceller ve meta version’ı artırır */
export async function updateSettings(data: Partial<SiteSettings>): Promise<void> {
  const batch = writeBatch(getDb());
  const configRef = doc(getDb(), 'settings', SETTINGS_CONFIG_KEY);
  const metaRef = doc(getDb(), 'settings', SETTINGS_META_KEY);

  const metaSnap = await getDoc(metaRef);
  const currentVersion = metaSnap.exists() ? Number((metaSnap.data() as { version?: number })?.version ?? 0) : 0;
  const newVersion = currentVersion + 1;

  batch.set(configRef, data, { merge: true });
  batch.set(metaRef, {
    version: newVersion,
    updatedAt: Timestamp.now(),
  });
  await batch.commit();
}

export function subscribeToSettings(cb: (settings: SiteSettings) => void) {
  return onSnapshot(doc(getDb(), 'settings', 'config'), (snap) => {
    if (snap.exists()) cb(snap.data() as SiteSettings);
  });
}

// ─── Categories ────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const snap = await getDocs(
    query(collection(getDb(), 'categories'), orderBy('order', 'asc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Category);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const snap = await getDocs(
    query(collection(getDb(), 'categories'), where('slug', '==', slug))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Category;
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<string> {
  const ref = await addDoc(collection(getDb(), 'categories'), data);
  return ref.id;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  await updateDoc(doc(getDb(), 'categories', id), data);
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'categories', id));
}

export async function updateCategoryOrders(items: { id: string; order: number }[]): Promise<void> {
  const batch = writeBatch(getDb());
  items.forEach(({ id, order }) => {
    batch.update(doc(getDb(), 'categories', id), { order });
  });
  await batch.commit();
}

// ─── Products ──────────────────────────────────────────────────────────────

export async function getProducts(constraints: QueryConstraint[] = []): Promise<Product[]> {
  const snap = await getDocs(query(collection(getDb(), 'products'), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  return getProducts([
    where('categoryId', '==', categoryId),
    where('isActive', '==', true),
    orderBy('createdAt', 'asc'),
  ]);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts([where('isFeatured', '==', true), where('isActive', '==', true)]);
}

export async function getBestSellerProducts(limitCount = 6): Promise<Product[]> {
  return getProducts([
    where('isActive', '==', true),
    orderBy('orderCount', 'desc'),
    limit(limitCount),
  ]);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const snap = await getDocs(
    query(collection(getDb(), 'products'), where('slug', '==', slug))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Product;
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(getDb(), 'products', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(getDb(), 'products'), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(getDb(), 'products', id), data);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'products', id));
}

export async function incrementProductOrderCount(id: string): Promise<void> {
  await updateDoc(doc(getDb(), 'products', id), { orderCount: increment(1) });
}

// ─── Orders ────────────────────────────────────────────────────────────────

export async function createOrder(data: Omit<Order, 'id'>): Promise<string> {
  const ref = await addDoc(collection(getDb(), 'orders'), data);
  return ref.id;
}

export async function getOrders(constraints: QueryConstraint[] = []): Promise<Order[]> {
  const snap = await getDocs(
    query(collection(getDb(), 'orders'), orderBy('createdAt', 'desc'), ...constraints)
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(getDb(), 'orders', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note = ''
): Promise<void> {
  const orderRef = doc(getDb(), 'orders', id);
  const snap = await getDoc(orderRef);
  if (!snap.exists()) return;

  const current = snap.data() as Order;
  const history = current.statusHistory || [];

  await updateDoc(orderRef, {
    status,
    statusHistory: [
      ...history,
      { status, timestamp: Timestamp.now(), note },
    ],
  });
}

export async function getTodayOrders(): Promise<Order[]> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  return getOrders([where('createdAt', '>=', Timestamp.fromDate(startOfDay))]);
}

export function subscribeToOrders(
  cb: (orders: Order[]) => void,
  constraints: QueryConstraint[] = []
) {
  return onSnapshot(
    query(collection(getDb(), 'orders'), orderBy('createdAt', 'desc'), ...constraints),
    (snap: QuerySnapshot<DocumentData>) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order));
    }
  );
}

// ─── Visitors ─────────────────────────────────────────────────────────────

export async function getVisitorByIpHash(ipHash: string): Promise<Visitor | null> {
  const snap = await getDocs(
    query(collection(getDb(), 'visitors'), where('ip', '==', ipHash))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Visitor;
}

export async function createVisitor(data: Omit<Visitor, 'id'>): Promise<string> {
  const ref = await addDoc(collection(getDb(), 'visitors'), data);
  return ref.id;
}

export async function updateVisitor(id: string, data: Partial<Visitor>): Promise<void> {
  await updateDoc(doc(getDb(), 'visitors', id), data);
}

export async function getVisitors(): Promise<Visitor[]> {
  const snap = await getDocs(
    query(collection(getDb(), 'visitors'), orderBy('lastVisit', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Visitor);
}

// ─── Blog Posts ───────────────────────────────────────────────────────────

export async function getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  const constraints: QueryConstraint[] = publishedOnly
    ? [where('isPublished', '==', true), orderBy('publishedAt', 'desc')]
    : [orderBy('createdAt', 'desc')];
  const snap = await getDocs(query(collection(getDb(), 'blog_posts'), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const snap = await getDocs(
    query(collection(getDb(), 'blog_posts'), where('slug', '==', slug))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as BlogPost;
}

export async function createBlogPost(data: Omit<BlogPost, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(getDb(), 'blog_posts'), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<void> {
  await updateDoc(doc(getDb(), 'blog_posts', id), data);
}

export async function deleteBlogPost(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'blog_posts', id));
}

// ─── Reviews ──────────────────────────────────────────────────────────────

export async function getReviews(visibleOnly = true): Promise<Review[]> {
  const snap = await getDocs(collection(getDb(), 'reviews'));
  let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Review);
  if (visibleOnly) items = items.filter((r) => r.isVisible !== false);
  items.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0;
    const tb = b.createdAt?.toMillis?.() ?? 0;
    return tb - ta;
  });
  return items;
}

export async function createReview(data: Omit<Review, 'id'>): Promise<string> {
  const ref = await addDoc(collection(getDb(), 'reviews'), data);
  return ref.id;
}

export async function updateReview(id: string, data: Partial<Review>): Promise<void> {
  await updateDoc(doc(getDb(), 'reviews', id), data);
}

export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'reviews', id));
}

// ─── Pages ────────────────────────────────────────────────────────────────

export async function getPages(publishedOnly = true): Promise<DynamicPage[]> {
  const constraints: QueryConstraint[] = publishedOnly
    ? [where('isPublished', '==', true), orderBy('order', 'asc')]
    : [orderBy('order', 'asc')];
  const snap = await getDocs(query(collection(getDb(), 'pages'), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as DynamicPage);
}

export async function getPageBySlug(slug: string): Promise<DynamicPage | null> {
  const snap = await getDocs(
    query(collection(getDb(), 'pages'), where('slug', '==', slug))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as DynamicPage;
}

export async function createPage(data: Omit<DynamicPage, 'id'>): Promise<string> {
  const ref = await addDoc(collection(getDb(), 'pages'), data);
  return ref.id;
}

export async function updatePage(id: string, data: Partial<DynamicPage>): Promise<void> {
  await updateDoc(doc(getDb(), 'pages', id), data);
}

export async function deletePage(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'pages', id));
}

// ─── Coupons ──────────────────────────────────────────────────────────────

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const snap = await getDocs(
    query(collection(getDb(), 'coupons'), where('code', '==', code.toUpperCase()))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Coupon;
}

export async function getCoupons(): Promise<Coupon[]> {
  const snap = await getDocs(
    query(collection(getDb(), 'coupons'), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Coupon);
}

export async function createCoupon(data: Omit<Coupon, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(getDb(), 'coupons'), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<void> {
  await updateDoc(doc(getDb(), 'coupons', id), data);
}

export async function deleteCoupon(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'coupons', id));
}

export async function incrementCouponUsage(id: string): Promise<void> {
  await updateDoc(doc(getDb(), 'coupons', id), { usageCount: increment(1) });
}

// ─── Blacklist ─────────────────────────────────────────────────────────────

export async function getBlacklist(): Promise<{ phones: string[]; addresses: string[] }> {
  const snap = await getDoc(doc(getDb(), 'settings', 'blacklist'));
  if (!snap.exists()) return { phones: [], addresses: [] };
  return snap.data() as { phones: string[]; addresses: string[] };
}

export async function addToBlacklist(type: 'phone' | 'address', value: string): Promise<void> {
  const ref = doc(getDb(), 'settings', 'blacklist');
  const snap = await getDoc(ref);
  const current = snap.exists()
    ? (snap.data() as { phones: string[]; addresses: string[] })
    : { phones: [], addresses: [] };

  if (type === 'phone') {
    await setDoc(ref, { ...current, phones: [...new Set([...current.phones, value])] });
  } else {
    await setDoc(ref, { ...current, addresses: [...new Set([...current.addresses, value])] });
  }
}

export async function removeFromBlacklist(type: 'phone' | 'address', value: string): Promise<void> {
  const ref = doc(getDb(), 'settings', 'blacklist');
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const current = snap.data() as { phones: string[]; addresses: string[] };

  if (type === 'phone') {
    await setDoc(ref, { ...current, phones: current.phones.filter((p) => p !== value) });
  } else {
    await setDoc(ref, { ...current, addresses: current.addresses.filter((a) => a !== value) });
  }
}

// ─── Contact Messages ────────────────────────────────────────────────────────

export interface ContactMessage {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Timestamp;
}

export async function addContact(data: Omit<ContactMessage, 'createdAt'>): Promise<void> {
  await addDoc(collection(getDb(), 'contacts'), {
    ...data,
    createdAt: Timestamp.now(),
  });
}
