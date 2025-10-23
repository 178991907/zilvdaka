'use client';
import { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { user } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

export default function AvatarPicker() {
  const avatarIds = ['avatar1', 'avatar2', 'avatar3', 'avatar4'];
  const avatars = PlaceHolderImages.filter(img => avatarIds.includes(img.id));
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);

  return (
    <div className="flex gap-4">
      {avatars.map(avatar => (
        <div
          key={avatar.id}
          className={cn(
            'relative cursor-pointer rounded-full border-2 transition-all',
            selectedAvatar === avatar.id ? 'border-primary' : 'border-transparent'
          )}
          onClick={() => setSelectedAvatar(avatar.id)}
        >
          <Image
            src={avatar.imageUrl}
            alt={avatar.description}
            width={80}
            height={80}
            className="rounded-full"
            data-ai-hint={avatar.imageHint}
          />
          {selectedAvatar === avatar.id && (
            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              <CheckCircle className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
