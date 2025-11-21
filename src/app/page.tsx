'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasCompletedOnboarding } from '@/lib/storage';
import { Dumbbell } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar baseado no estado do onboarding
    if (hasCompletedOnboarding()) {
      router.push('/home');
    } else {
      router.push('/onboarding');
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <div className="animate-pulse">
        <Dumbbell className="w-16 h-16 text-white" />
      </div>
      <p className="text-white text-xl font-semibold mt-4">TurboFit</p>
    </div>
  );
}
