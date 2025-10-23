'use client';
import { useState, useRef } from 'react';
import { Avatars, AvatarInfo } from '@/lib/placeholder-images';
import { user } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CheckCircle, Upload } from 'lucide-react';

// A simple utility to get the avatar by ID
const getAvatarById = (id: string | null) => Avatars.find(a => a.id === id) || null;

export default function AvatarPicker() {
  const [selectedAvatarId, setSelectedAvatarId] = useState(user.avatar);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setSelectedAvatarId('uploaded'); // Special ID for uploaded image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {/* Upload Button */}
      <div
        className={cn(
          'relative cursor-pointer rounded-full border-2 transition-all aspect-square w-full flex items-center justify-center bg-secondary/50 hover:bg-secondary',
           selectedAvatarId === 'uploaded' ? 'border-primary' : 'border-dashed'
        )}
        onClick={handleUploadClick}
        role="button"
        aria-label="Upload custom avatar"
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        {uploadedImage && selectedAvatarId === 'uploaded' ? (
          <img
            src={uploadedImage}
            alt="Uploaded avatar"
            className="rounded-full aspect-square object-cover w-full h-full"
          />
        ) : (
          <div className="text-center p-2">
            <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
            <p className="text-xs mt-1 text-muted-foreground">上传</p>
          </div>
        )}
        {selectedAvatarId === 'uploaded' && (
           <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
             <CheckCircle className="h-4 w-4 text-primary-foreground" />
           </div>
         )}
      </div>

      {/* Pre-defined SVG Avatars */}
      {Avatars.map((avatar) => (
        <div
          key={avatar.id}
          className={cn(
            'relative cursor-pointer rounded-full border-2 transition-all aspect-square w-full p-2 bg-card',
            selectedAvatarId === avatar.id ? 'border-primary' : 'border-transparent'
          )}
          onClick={() => {
            setSelectedAvatarId(avatar.id);
            setUploadedImage(null); // Clear uploaded image if a pre-defined one is selected
          }}
          role="button"
          aria-label={`Select ${avatar.name} avatar`}
        >
          <div dangerouslySetInnerHTML={{ __html: avatar.svg }} className="w-full h-full" />
          {selectedAvatarId === avatar.id && (
            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              <CheckCircle className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
