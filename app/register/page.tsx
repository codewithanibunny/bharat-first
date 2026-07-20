"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AshokaChakra } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { THEMES } from "@/constants/theme";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-6">
          <AshokaChakra size={48} className="text-[#FF6B00]" />
        </div>
        <h2 className="text-center text-3xl font-black uppercase tracking-tight">
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#FF6B00] hover:text-[#e05e00] transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1A1A1A] py-8 px-4 border border-[#2E2E2E] shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 text-sm rounded">
                {error}
              </div>
            )}
            
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase tracking-wider text-gray-300"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-[#2E2E2E] rounded-md shadow-sm bg-[#0D0D0D] text-white focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-[#2E2E2E] rounded-md shadow-sm bg-[#0D0D0D] text-white focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-gray-300"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-[#2E2E2E] rounded-md shadow-sm bg-[#0D0D0D] text-white focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#FF6B00] hover:bg-[#e05e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0D0D0D] focus:ring-[#FF6B00] disabled:opacity-50 transition-colors"
                themeObj={THEMES.dark}
              >
                {loading ? "Creating..." : "Register"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
