
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { menuItems } from "@/lib/navigation";
import { usePathname } from "next/navigation";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <main className="flex-1">{children}</main>;
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6 text-primary"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
              </svg>
              <h1 className="text-lg font-semibold">FiscalFlow</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {/* Home Link */}
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none"
              >
                Home
              </Link>
              
              {/* Executive Dashboard Link */}
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none"
              >
                Executive Dashboard
              </Link>

              {/* Dynamic Menu Items */}
              <Menubar className="border-none bg-transparent p-0">
                {menuItems.map((item) => (
                  <MenubarMenu key={item.title}>
                    <MenubarTrigger>{item.title}</MenubarTrigger>
                    <MenubarContent>
                      {item.links.map((link) => {
                        const LinkIcon = link.icon;
                        return (
                          <MenubarItem key={link.title} asChild>
                            <Link href={link.href}>
                              <LinkIcon className="mr-2 h-4 w-4" />
                              <span>{link.title}</span>
                            </Link>
                          </MenubarItem>
                        );
                      })}
                    </MenubarContent>
                  </MenubarMenu>
                ))}
              </Menubar>
            </div>
            <Link href="/login" passHref>
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
