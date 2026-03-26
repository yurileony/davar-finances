import { AppShell } from "@/components/app-shell";
import { MonthlyOverviewChart } from "@/components/charts/monthly-overview-chart";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

type SearchParams = Promise<{ month?: string }>;

export default async function DashboardPage({
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
    .select("*")
    .gte("transaction_date", start)
    .lte("transaction_date", end)
    .order("transaction_date", { ascending: true });

  const safeTx = transactions ?? [];
  const income = safeTx
    .filter((t) => t.type === "income")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);
  const expenses = safeTx
    .filter((t) => t.type === "expense")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const byDay: Record<string, { income: number; expense: number }> = {};
  safeTx.forEach((t) => {
    const day = new Date(t.transaction_date).getDate().toString();
    if (!byDay[day]) byDay[day] = { income: 0, expense: 0 };
    if (t.type === "income") byDay[day].income += Number(t.amount);
    else byDay[day].expense += Number(t.amount);
  });

  const chartPoints = Array.from({ length: 31 }).map((_, i) => {
    const key = (i + 1).toString();
    return {
      day: key,
      income: byDay[key]?.income ?? 0,
      expense: byDay[key]?.expense ?? 0
    };
  });

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="glass rounded-3xl p-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <form className="mt-3 flex items-center gap-2" method="get">
            <input
              type="month"
              name="month"
              defaultValue={month}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
            <button className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white">
              Apply
            </button>
          </form>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-emerald-500/10 p-4">
              <p className="text-sm text-slate-500">Income</p>
              <p className="text-xl font-semibold text-emerald-500">{formatCurrency(income)}</p>
            </div>
            <div className="rounded-2xl bg-red-500/10 p-4">
              <p className="text-sm text-slate-500">Expenses</p>
              <p className="text-xl font-semibold text-red-500">{formatCurrency(expenses)}</p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-4">
              <p className="text-sm text-slate-500">Total balance</p>
              <p className="text-xl font-semibold text-primary">
                {formatCurrency(income - expenses)}
              </p>
            </div>
          </div>
        </div>
        <div className="glass rounded-3xl p-4">
          <h2 className="mb-4 text-lg font-semibold">Financial chart</h2>
          <MonthlyOverviewChart points={chartPoints} />
        </div>
      </div>
    </AppShell>
  );
}
