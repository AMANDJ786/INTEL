"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HelpCircle,
  FileText,
  Sparkles,
  BrainCircuit
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ask", label: "Ask AI", icon: HelpCircle },
  { href: "/summarize", label: "Summarizer", icon: FileText },
  { href: "/quiz", label: "Quiz AI", icon: Sparkles },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold tracking-tighter text-primary">AICademy</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className="justify-start"
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="text-base font-medium">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* User profile or settings can be added here */}
      </SidebarFooter>
    </Sidebar>
  );
}
