'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { user } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { CreditCard, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const ClientOnlyT = ({ tKey, tOptions }: { tKey: string, tOptions?: any }) => {
    const { t, i18n } = useTranslation();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Fallback logic for server-side rendering
        const resources = i18n.getResourceBundle('en', 'translation');
        let fallbackText;
        try {
            fallbackText = tKey.split('.').reduce((acc, part) => acc && (acc as any)[part], resources);
            if (tOptions && typeof fallbackText === 'string') {
               Object.keys(tOptions).forEach(key => {
                    fallbackText = fallbackText.replace(`{{${key}}}`, tOptions[key]);
               });
            }
        } catch (e) {
            // ignore
        }

        return fallbackText || tKey;
    }

    return t(tKey, tOptions);
};


export function UserNav() {
  const { t } = useTranslation();
  const avatarImage = PlaceHolderImages.find(img => img.id === user.avatar);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-full justify-start gap-2 px-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarImage?.imageUrl} alt={user.name} data-ai-hint={avatarImage?.imageHint} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
           <div className="flex flex-col items-start truncate">
              <span className="font-semibold text-sm truncate">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                <ClientOnlyT tKey="user.level" tOptions={{ level: user.level }} />
              </span>
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
