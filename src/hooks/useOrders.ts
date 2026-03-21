'use client';

import { useEffect, useState } from 'react';
import { subscribeToActiveOrders, subscribeToOrderStatus } from '@/lib/firebase/realtime';
import { subscribeToOrders } from '@/lib/firebase/firestore';
import type { Order, ActiveOrder } from '@/types';
import { where } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export function useActiveOrders() {
  const [activeOrders, setActiveOrders] = useState<Record<string, ActiveOrder>>({});

  useEffect(() => {
    const unsub = subscribeToActiveOrders(setActiveOrders);
    return unsub;
  }, []);

  return activeOrders;
}

export function useTodayOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const unsub = subscribeToOrders(
      (o) => {
        setOrders(o);
        setIsLoading(false);
      },
      [where('createdAt', '>=', Timestamp.fromDate(startOfDay))]
    );

    return () => unsub();
  }, []);

  return { orders, isLoading };
}

export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToOrders((o) => {
      setOrders(o);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  return { orders, isLoading };
}

export function useOrderStatus(orderId: string) {
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const unsub = subscribeToOrderStatus(orderId, setActiveOrder);
    return unsub;
  }, [orderId]);

  return activeOrder;
}
