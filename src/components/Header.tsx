"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Wrench, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";

export function Header() {
  const pathname = usePathname();

  // Hide header on admin and login pages for a focused experience
  if (pathname.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'New Ticket' },
    { href: '/track', label: 'Track Repair' },
  ];

  return (
    <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Wrench className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">Device Rx</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
            <nav className="flex items-center gap-2">
                {navLinks.map(link => (
                    <Button key={link.href} asChild variant={pathname === link.href ? 'secondary' : 'ghost'} size="sm">
                        <Link href={link.href}>{link.label}</Link>
                    </Button>
                ))}
            </nav>
            <ThemeToggle />
            <Button asChild variant="outline" size="sm">
                <Link href="/login">Admin</Link>
            </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0">
                    <SheetTitle className="sr-only">Main Menu</SheetTitle>
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b">
                            <SheetClose asChild>
                                <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                                    <Wrench className="h-7 w-7 text-primary" />
                                    <span className="text-xl font-bold">Device Rx</span>
                                </Link>
                            </SheetClose>
                        </div>
                        
                        <nav className="flex flex-col gap-2 p-4 text-base">
                            {navLinks.map(link => (
                                <SheetClose key={link.href} asChild>
                                    <Link 
                                        href={link.href} 
                                        className={`-mx-2 flex items-center gap-4 rounded-md p-2 text-foreground/80 hover:text-foreground hover:bg-muted ${
                                            pathname === link.href ? 'bg-muted text-foreground font-semibold' : ''
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                </SheetClose>
                            ))}
                        </nav>
                        
                        <div className="mt-auto border-t p-4">
                             <SheetClose asChild>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/login">Admin Login</Link>
                                </Button>
                            </SheetClose>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
