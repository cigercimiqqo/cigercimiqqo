'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        document.cookie = 'miqqo_auth_token=1; path=/; max-age=604800; SameSite=Lax';
      } else {
        document.cookie = 'miqqo_auth_token=; path=/; max-age=0';
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  async function login(email: string, password: string, remember = false) {
    await signInWithEmailAndPassword(auth, email, password);
    const maxAge = remember ? 604800 : undefined;
    document.cookie = `miqqo_auth_token=1; path=/; ${maxAge ? `max-age=${maxAge};` : ''} SameSite=Lax`;
  }

  async function logout() {
    await signOut(auth);
    document.cookie = 'miqqo_auth_token=; path=/; max-age=0';
  }

  return { user, isLoading, login, logout };
}
