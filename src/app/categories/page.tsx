import { AppShell } from "@/components/app-shell";
import { CategoriesManager } from "@/components/categories-manager";
import { createClient } from "@/lib/supabase/server";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return (
    <AppShell>
      <CategoriesManager initialCategories={(categories ?? []) as never[]} />
    </AppShell>
  );
}
