import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Trophy, Star, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Star className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            Habit Heroes
          </h1>
        </div>
        <Button asChild>
          <Link href="/dashboard">Get Started</Link>
        </Button>
      </header>

      <main className="flex-grow">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-foreground">
              Become a Hero of Your Habits!
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Turn daily tasks into exciting adventures. Grow your pet, earn badges, and build life-long habits with Habit Heroes.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">Start Your Adventure</Link>
              </Button>
            </div>
            <div className="mt-16 relative">
              <Image
                src="https://picsum.photos/seed/habithero/1200/600"
                alt="Habit Heroes Dashboard Preview"
                width={1200}
                height={600}
                className="rounded-xl shadow-2xl mx-auto"
                data-ai-hint="dashboard kids app"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center font-headline">Features for Future Heroes</h3>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<CheckCircle className="w-10 h-10 text-primary" />}
                title="Custom Tasks"
                description="Create and customize daily missions to conquer your goals."
              />
              <FeatureCard
                icon={<Trophy className="w-10 h-10 text-accent" />}
                title="Earn Badges"
                description="Celebrate your victories and collect awesome achievement badges."
              />
              <FeatureCard
                icon={<Star className="w-10 h-10 text-primary" />}
                title="Grow a Pet"
                description="Your virtual companion grows and evolves as you complete your tasks."
              />
              <FeatureCard
                icon={<Shield className="w-10 h-10 text-accent" />}
                title="Parental Tools"
                description="Parents can monitor progress, set rewards, and support their little heroes."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Habit Heroes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto bg-secondary p-4 rounded-full w-fit">
          {icon}
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
