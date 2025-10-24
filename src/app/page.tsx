'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getUser, User } from '@/lib/data';

export default function LandingPage() {
  const [content, setContent] = useState<Partial<User>>({});

  useEffect(() => {
    // In a real app, this might be fetched, but here we get it from our data source
    const userConfig = getUser();
    setContent(userConfig);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-[60px] items-center justify-end border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
        <nav>
          <Button asChild>
            <Link href="/dashboard">
                {content.dashboardLink || 'Go to Dashboard'}
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                {content.landingTitle || 'Title'}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
                {content.landingDescription || 'Description'}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="mt-8"
          >
            <Button asChild size="lg" className="text-lg">
              <Link href="/dashboard">
                {content.landingCta || 'Get Started'}
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>

       <footer className="py-4 text-center text-xs text-muted-foreground">
            <a href="https://web.terry.dpdns.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              © 2025 英语全科启蒙. All Rights Reserved.『Terry开发与维护』
            </a>
       </footer>
    </div>
  );
}
