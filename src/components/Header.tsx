"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Wrench className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">Device Rx</span>
        </Link>
        <nav className="flex items-center gap-2">
            <Button asChild variant={pathname === '/' ? 'secondary' : 'ghost'} size="sm">
                <Link href="/">New Ticket</Link>
            </Button>
            <Button asChild variant={pathname === '/track' ? 'secondary' : 'ghost'} size="sm">
                <Link href="/track">Track Repair</Link>
            </Button>
        </nav>
      </div>
    </header>
  );
}
