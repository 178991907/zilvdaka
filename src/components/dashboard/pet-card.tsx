'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { getUser, User } from '@/lib/data';
import PetViewer from '@/components/dashboard/pet-viewer';
import { ClientOnlyT } from '../layout/app-sidebar';

export default function PetCard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleUserUpdate = () => {
      setUser(getUser());
    };

    handleUserUpdate(); // Initial load

    window.addEventListener('userProfileUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('userProfileUpdated', handleUserUpdate);
    };
  }, []);

  if (!user) {
    return (
      <Card className="h-full flex flex-col">
        <CardContent className="p-6 flex-grow flex flex-col items-center justify-center">
          <Skeleton className="w-full h-full min-h-[200px]" />
          <div className="mt-4 w-full">
            <Skeleton className="h-6 w-24 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto mt-2" />
            <Skeleton className="h-2 w-full mt-4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const petProgress = user ? (user.xp / user.xpToNextLevel) * 100 : 0;

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardContent className="flex flex-col p-0 h-full">
        {/* This div will grow and push the text content to the bottom */}
        <div className="flex justify-center w-full">
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
              <PetViewer petStyle={user.petStyle} progress={petProgress} className="w-full h-96" />
          </Suspense>
        </div>
        
        {/* This div will be pushed to the bottom */}
        <div className="text-center w-full p-6 pt-0 mt-auto">
          <p className="text-lg font-bold">{user.petName}</p>
          <p className="text-sm text-muted-foreground">
            <ClientOnlyT tKey='user.level' tOptions={{ level: user.level }} />
          </p>
          <Progress value={petProgress} className="mt-4 h-2 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
