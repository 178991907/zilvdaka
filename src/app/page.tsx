'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
        <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0">
                <Star className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg font-headline text-foreground">
                <ClientOnlyT tKey="appName" />
            </span>
        </div>
        <nav>
          <Button asChild>
            <Link href="/dashboard">
                <ClientOnlyT tKey="landing.goToDashboard" />
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
                <ClientOnlyT tKey="landing.title" />
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
                <ClientOnlyT tKey="landing.description" />
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
                <ClientOnlyT tKey="landing.getStarted" />
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
