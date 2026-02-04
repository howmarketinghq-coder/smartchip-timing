"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        showToast("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        router.push("/admin/dashboard");
      }
    } catch {
      showToast("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="pt-20 px-4 max-w-[800px] mx-auto">
        <div className="max-w-[400px] mx-auto my-16 bg-bg-secondary rounded-xl p-10 border border-border">
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl text-center mb-8 tracking-[2px]">
            ADMIN LOGIN
          </h2>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Input
                label="아이디"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
                autoComplete="off"
              />
            </div>
            <div className="mb-6">
              <Input
                label="비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <p className="text-center mt-4 text-xs text-text-muted">
            데모 계정: admin / smartchip2026
          </p>
        </div>
      </main>
    </>
  );
}
