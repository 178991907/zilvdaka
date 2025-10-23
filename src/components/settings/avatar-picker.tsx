'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { user } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CheckCircle, Upload } from 'lucide-react';

export default function AvatarPicker() {
  const avatarIds = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6', 'avatar7', 'avatar8', 'avatar9', 'avatar10', 'avatar11', 'avatar12', 'avatar13', 'avatar14', 'avatar15', 'avatar16'];
  const avatars = PlaceHolderImages.filter(img => avatarIds.includes(img.id));
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setSelectedAvatar('uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* Upload Button */}
      <div
        className={cn(
          'relative cursor-pointer rounded-full border-2 transition-all aspect-square w-20 h-20 flex items-center justify-center bg-secondary/50 hover:bg-secondary',
           selectedAvatar === 'uploaded' ? 'border-primary' : 'border-dashed'
        )}
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        {uploadedImage && selectedAvatar === 'uploaded' ? (
          <Image
            src={uploadedImage}
            alt="Uploaded avatar"
            width={80}
            height={80}
            className="rounded-full aspect-square object-cover"
          />
        ) : (
          <div className="text-center">
            <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
            <p className="text-xs mt-1 text-muted-foreground">上传</p>
          </div>
        )}
        {selectedAvatar === 'uploaded' && (
           <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
             <CheckCircle className="h-4 w-4 text-primary-foreground" />
           </div>
         )}
      </div>

      {/* Pre-defined Avatars */}
      {avatars.map((avatar) => (
        <div
          key={avatar.id}
          className={cn(
            'relative cursor-pointer rounded-full border-2 transition-all aspect-square w-20 h-20',
            selectedAvatar === avatar.id ? 'border-primary' : 'border-transparent'
          )}
          onClick={() => setSelectedAvatar(avatar.id)}
        >
          <Image
            src={avatar.imageUrl}
            alt={avatar.description}
            width={80}
            height={80}
            className="rounded-full aspect-square object-cover bg-card"
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
