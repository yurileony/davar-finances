import { AppShell } from "@/components/app-shell";
import { TransactionsManager } from "@/components/transactions-manager";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<{ month?: string }>;

export default async function TransactionsPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const month = (await searchParams).month ?? new Date().toISOString().slice(0, 7);
  const start = `${month}-01`;
  const end = `${month}-31`;

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, categories(id,name,type,color)")
    .gte("transaction_date", start)
    .lte("transaction_date", end)
    .order("transaction_date", { ascending: false });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return (
    <AppShell>
      <form method="get" className="glass mb-4 flex items-center gap-2 rounded-2xl p-3">
        <input
          type="month"
          name="month"
          defaultValue={month}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        <button className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white">
          Apply month
        </button>
      </form>
      <TransactionsManager
        initialTransactions={(transactions ?? []) as never[]}
        categories={(categories ?? []) as never[]}
        month={month}
      />
    </AppShell>
  );
}
