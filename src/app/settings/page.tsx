"use client";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const value = !dark;
    setDark(value);
    localStorage.setItem("theme", value ? "dark" : "light");
    document.documentElement.classList.toggle("dark", value);
  };

  return (
    <AppShell>
      <div className="glass rounded-3xl p-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mb-4 mt-1 text-sm text-slate-500">Modern UI with dark mode and glass effect.</p>
        <Button onClick={toggle}>{dark ? "Disable dark mode" : "Enable dark mode"}</Button>
      </div>
    </AppShell>
  );
}
