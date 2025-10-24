'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getUser, User } from '@/lib/data';
import Image from 'next/image';

export default function LandingPage() {
  const [content, setContent] = useState<Partial<User>>({});

  useEffect(() => {
    // In a real app, this might be fetched, but here we get it from our data source
    const userConfig = getUser();
    setContent(userConfig);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-[70px] items-center justify-between bg-background/80 backdrop-blur-sm px-4 md:px-8">
        <div className="flex items-center gap-2 w-1/3">
        </div>
        <div className="flex justify-center w-1/3">
          <Image src="https://pic1.imgdb.cn/item/6817c79a58cb8da5c8dc723f.png" alt="Logo" width={180} height={57} priority className="h-[57px] w-auto" />
        </div>
        <nav className="flex justify-end w-1/3">
          <Button asChild>
            <Link href="/dashboard">
                {content.dashboardLink || 'Go to Dashboard'}
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        
      </main>

       <footer className="py-4 text-center text-xl text-muted-foreground">
            <a href="https://web.terry.dpdns.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              © 2025 英语全科启蒙. All Rights Reserved.『Terry开发与维护』
            </a>
       </footer>
    </div>
  );
}
