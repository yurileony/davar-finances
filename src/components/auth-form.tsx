"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    if (mode === "signup") {
      const { error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (signError) setError(signError.message);
      else router.push("/dashboard");
    } else {
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (signError) setError(signError.message);
      else router.push("/dashboard");
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="glass mx-auto w-full max-w-md rounded-3xl p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">
        {mode === "login" ? "Welcome back" : "Create account"}
      </h1>
      {mode === "signup" && (
        <div className="mb-4">
          <label className="mb-1 block text-sm">Full name</label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
      )}
      <div className="mb-4">
        <label className="mb-1 block text-sm">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <Button disabled={loading} className="w-full">
        {loading ? "Loading..." : mode === "login" ? "Login" : "Sign up"}
      </Button>
    </form>
  );
}
