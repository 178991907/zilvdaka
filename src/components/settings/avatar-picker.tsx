'use client';
import { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { user } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function AvatarPicker() {
  const avatarIds = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6', 'avatar7', 'avatar8'];
  const avatars = PlaceHolderImages.filter(img => avatarIds.includes(img.id));
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: false,
      }}
      className="w-full max-w-sm"
    >
      <CarouselContent className="-ml-2">
        {avatars.map((avatar, index) => (
          <CarouselItem key={index} className="pl-4 basis-1/3 md:basis-1/4">
            <div
              className={cn(
                'relative cursor-pointer rounded-full border-2 transition-all aspect-square',
                selectedAvatar === avatar.id ? 'border-primary' : 'border-transparent'
              )}
              onClick={() => setSelectedAvatar(avatar.id)}
            >
              <Image
                src={avatar.imageUrl}
                alt={avatar.description}
                width={80}
                height={80}
                className="rounded-full aspect-square object-cover"
                data-ai-hint={avatar.imageHint}
              />
              {selectedAvatar === avatar.id && (
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <CheckCircle className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
