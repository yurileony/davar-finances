"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import type { Category, Transaction, TransactionType } from "@/lib/types";

type Props = {
  initialTransactions: Transaction[];
  categories: Category[];
  month: string;
};

export function TransactionsManager({
  initialTransactions,
  categories,
  month
}: Props) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "expense" as TransactionType,
    transaction_date: `${month}-01`,
    category_id: ""
  });

  const totals = useMemo(
    () =>
      transactions.reduce(
        (acc, t) => {
          if (t.type === "income") acc.income += Number(t.amount);
          else acc.expense += Number(t.amount);
          return acc;
        },
        { income: 0, expense: 0 }
      ),
    [transactions]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        description: form.description,
        amount: Number(form.amount),
        type: form.type,
        transaction_date: form.transaction_date,
        category_id: form.category_id || null
      })
      .select("*, categories(id,name,type,color)")
      .single();

    if (!error && data) {
      setTransactions((prev) => [data as Transaction, ...prev]);
      setForm({
        description: "",
        amount: "",
        type: "expense",
        transaction_date: `${month}-01`,
        category_id: ""
      });
    }
  };

  const togglePaid = async (id: string, current: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("transactions")
      .update({ is_paid: !current, paid_at: !current ? new Date().toISOString() : null })
      .eq("id", id);

    if (!error) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_paid: !current } : t))
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-4">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <p className="text-sm text-slate-500">
          Income: {formatCurrency(totals.income)} | Expenses: {formatCurrency(totals.expense)}
        </p>
      </div>

      <form onSubmit={submit} className="glass grid gap-3 rounded-3xl p-4 md:grid-cols-5">
        <Input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <Input
          placeholder="Amount"
          type="number"
          min="0.01"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <select
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <Input
          type="date"
          value={form.transaction_date}
          onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
        />
        <select
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">No category</option>
          {categories
            .filter((c) => c.type === form.type)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
        <Button className="md:col-span-5">Add transaction</Button>
      </form>

      <div className="space-y-2">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="glass flex flex-col gap-2 rounded-2xl p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold">{t.description}</p>
              <p className="text-xs text-slate-500">
                {format(new Date(t.transaction_date), "dd/MM/yyyy")} |{" "}
                {t.categories?.name ?? "No category"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p
                className={
                  t.type === "income"
                    ? "font-semibold text-emerald-500"
                    : "font-semibold text-red-500"
                }
              >
                {t.type === "income" ? "+" : "-"} {formatCurrency(Number(t.amount))}
              </p>
              <Button variant="outline" onClick={() => togglePaid(t.id, t.is_paid)}>
                {t.is_paid ? "Paid" : "Mark as paid"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
