export type TransactionType = "income" | "expense";

export type Category = {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  transaction_date: string;
  is_paid: boolean;
  category_id: string | null;
  notes: string | null;
  categories?: Category | null;
};
