"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Wallet, BadgeDollarSign, Tags, LogOut, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/transactions", label: "Transactions", icon: Wallet },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-4 p-4">
      <aside className="glass hidden w-64 rounded-3xl p-4 md:block">
        <div className="mb-6 flex items-center gap-2 text-xl font-bold">
          <BadgeDollarSign className="text-primary" />
          DAVAR Finances
        </div>
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
                pathname === item.href
                  ? "bg-primary text-white"
                  : "hover:bg-white/60 dark:hover:bg-slate-800"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
          <button
            onClick={signOut}
            className="mt-8 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </nav>
      </aside>

      <main className="w-full">{children}</main>
    </div>
  );
}
