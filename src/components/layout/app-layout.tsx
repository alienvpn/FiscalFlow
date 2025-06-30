"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState, useEffect } from "react";

const menuItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: Icons.Dashboard,
  },
  {
    href: "/capex-analysis",
    label: "CAPEX Analysis",
    icon: Icons.Capex,
  },
  {
    href: "/opex-tracker",
    label: "OPEX Tracker",
    icon: Icons.Opex,
  },
  {
    href: "/opex-registry",
    label: "OPEX Registry",
    icon: Icons.OpexRegistry,
  },
  {
    href: "/contracts",
    label: "Contracts",
    icon: Icons.Contracts,
  },
  {
    href: "/budget-forecasting",
    label: "Budget Forecasting",
    icon: Icons.Forecasting,
  },
   {
    href: "/capex-registry",
    label: "CAPEX Registry",
    icon: Icons.CapexRegistry,
  },
  {
    href: "/item-registry",
    label: "Device/Item/Service Registry",
    icon: Icons.Registry,
  },
  {
    href: "/master-data/company-profile",
    label: "Master Data",
    icon: Icons.MasterData,
  },
  {
    href: "/master-data/vendors",
    label: "Vendors",
    icon: Icons.Vendors,
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <SidebarProvider>
      <Sidebar className="print:hidden">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6 text-primary"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
            </svg>
            <h1 className="text-[14px] font-semibold">FiscalFlow</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                    className="text-[14px]"
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="https://placehold.co/100x100.png"
                alt="User"
                data-ai-hint="user avatar"
              />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-[14px] font-semibold">Admin User</span>
              <span className="text-[14px] text-muted-foreground">
                admin@fiscalflow.com
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {mounted ? (
          <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:hidden print:hidden">
            <SidebarTrigger />
          </header>
        ) : <div className="h-14 md:hidden print:hidden"/>}
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
