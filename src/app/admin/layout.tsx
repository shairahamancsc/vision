"use client"

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Wrench, LayoutDashboard, Ticket, ShoppingCart, Users, Power, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/tickets', label: 'Tickets', icon: Ticket },
    { href: '/admin/products', label: 'Products', icon: ShoppingCart },
    { href: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                <Wrench className="h-6 w-6 text-primary" />
                <span>Device Rx Admin</span>
            </Link>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                pathname === item.href ? 'bg-muted text-primary' : ''
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t">
            <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
                <Power className="h-4 w-4" />
                Logout
            </Link>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:hidden">
            <Sheet>
                <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs p-0">
                    <div className="flex h-full flex-col">
                        <div className="flex h-16 shrink-0 items-center border-b px-6">
                            <SheetClose asChild>
                                <Link href="/" className="flex items-center gap-2 font-semibold">
                                    <Wrench className="h-6 w-6 text-primary" />
                                    <span>Device Rx Admin</span>
                                </Link>
                            </SheetClose>
                        </div>
                        <nav className="flex-1 space-y-2 p-4">
                            {navItems.map((item) => (
                                <SheetClose asChild key={item.href}>
                                    <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                                        pathname === item.href ? 'bg-muted text-primary' : ''
                                    }`}
                                    >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                    </Link>
                                </SheetClose>
                            ))}
                        </nav>
                        <div className="mt-auto p-4 border-t">
                            <SheetClose asChild>
                                <Link
                                    href="/"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                >
                                    <Power className="h-4 w-4" />
                                    Logout
                                </Link>
                            </SheetClose>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
             <Link href="/admin" className="flex items-center gap-2 font-semibold">
                <Wrench className="h-6 w-6 text-primary" />
                <span className="">Device Rx Admin</span>
            </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
