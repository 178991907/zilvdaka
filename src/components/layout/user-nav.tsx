'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUser, User } from '@/lib/data';
import { Avatars } from '@/lib/placeholder-images';
import Link from 'next/link';
import { CreditCard, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from './app-sidebar';
import { useState, useEffect } from 'react';

export function UserNav() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User>(getUser());

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUser(getUser());
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    
    // Initial load
    handleProfileUpdate();

    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  const selectedAvatar = Avatars.find(img => img.id === user.avatar);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-full justify-start gap-2 px-2"
        >
          <Avatar className="h-8 w-8 bg-card p-1">
            {selectedAvatar ? (
              <div dangerouslySetInnerHTML={{ __html: selectedAvatar.svg }} className="w-full h-full" />
            ) : (
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
           <div className="flex flex-col items-start truncate">
              <span className="font-semibold text-sm truncate">{user.name}</span>
              <ClientOnlyT tKey="user.level" tOptions={{ level: user.level }} />
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.name.toLowerCase().replace(' ', '.')}@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/settings">
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span><ClientOnlyT tKey='user.menu.profile' /></span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span><ClientOnlyT tKey='user.menu.billing' /></span>
          </DropdownMenuItem>
          <Link href="/dashboard/settings">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span><ClientOnlyT tKey='user.menu.settings' /></span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href="/">
            <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span><ClientOnlyT tKey='user.menu.logout' /></span>
            </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
