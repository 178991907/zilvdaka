'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  const petProgress = user ? (user.xp / user.xpToNextLevel) * 100 : 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle><ClientOnlyT tKey='dashboard.myPet' /></CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-4">
        {user ? (
          <>
            <div className="flex-grow flex items-center justify-center min-h-[200px]">
              <Suspense fallback={<Skeleton className="w-full h-full" />}>
                <PetViewer progress={petProgress} />
              </Suspense>
            </div>
            <div className="mt-4">
              <div className="text-center">
                <p className="text-lg font-bold">{user.petName}</p>
                <p className="text-sm text-muted-foreground">
                  <ClientOnlyT tKey='user.level' tOptions={{ level: user.level }} />
                </p>
              </div>
              <Progress value={petProgress} className="mt-4 h-2" />
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col">
            <div className='flex-grow flex items-center justify-center'>
              <Skeleton className="w-full h-full" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-6 w-24 mx-auto" />
              <Skeleton className="h-4 w-16 mx-auto mt-2" />
              <Skeleton className="h-2 w-full mt-4" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
