"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category, TransactionType } from "@/lib/types";

export function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [color, setColor] = useState("#00C9A7");

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .insert({ name, type, color })
      .select("*")
      .single();
    if (!error && data) {
      setCategories((prev) => [...prev, data as Category]);
      setName("");
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={createCategory} className="glass grid gap-3 rounded-3xl p-4 md:grid-cols-4">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <Input value={color} onChange={(e) => setColor(e.target.value)} type="color" />
        <Button>Add category</Button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.id} className="glass flex items-center justify-between rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
              <div>
                <p className="font-semibold">{category.name}</p>
                <p className="text-xs text-slate-500">{category.type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
