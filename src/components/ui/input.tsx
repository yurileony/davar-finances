import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-primary/50 placeholder:text-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-900",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
