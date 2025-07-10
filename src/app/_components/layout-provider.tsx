'use client';

import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainNav } from '@/components/layout/main-nav';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <MainNav />
      <SidebarInset>
        <main className="min-h-screen">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
