"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isEvents = pathname === "/events";
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,10,10,0.95)] backdrop-blur-[10px] border-b border-border">
      <div className="max-w-[520px] mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo SVG */}
          <svg className="w-9 h-[18px]" viewBox="0 0 40 20" fill="none">
            <path
              d="M5 15C5 15 10 2 20 10C30 18 35 5 35 5"
              stroke="#E30613"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col">
            <span className="font-[family-name:var(--font-oswald)] text-[8px] text-accent-red tracking-[1px] font-normal">
              No1 Timing System
            </span>
            <span className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-[2px] leading-none text-text-primary">
              SMART CHIP
            </span>
          </div>
        </Link>

        {isHome ? (
          <nav className="flex gap-4">
            <Link
              href="/"
              className={cn(
                "text-xs font-medium tracking-[0.5px] transition-colors",
                pathname === "/" ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              HOME
            </Link>
            <Link
              href="/events"
              className={cn(
                "text-xs font-medium tracking-[0.5px] transition-colors",
                isEvents ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              기록조회
            </Link>
            <Link
              href="/admin/login"
              className={cn(
                "text-xs font-medium tracking-[0.5px] transition-colors",
                isAdmin ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              관리자
            </Link>
          </nav>
        ) : (
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center text-text-primary hover:text-accent-red transition-colors"
            title="홈으로"
          >
            <Home size={20} />
          </Link>
        )}
      </div>
    </header>
  );
}
