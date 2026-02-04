"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { Event } from "@/types";

interface PastEventDropdownProps {
  events: Event[];
}

export default function PastEventDropdown({ events }: PastEventDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter((event) => {
    const query = searchQuery.toLowerCase();
    return (
      event.name.toLowerCase().includes(query) ||
      formatDate(event.date).includes(query)
    );
  });

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-bg-secondary">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex justify-between items-center bg-transparent text-text-primary text-[15px] cursor-pointer transition-colors hover:bg-bg-card"
      >
        <span>지난 1년간의 대회 기록 조회</span>
        <ChevronDown
          size={20}
          className={cn(
            "transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-400",
          isOpen ? "max-h-[600px] overflow-y-auto" : "max-h-0"
        )}
      >
        {/* Notice */}
        <div className="px-5 pt-4 pb-2 bg-gradient-to-br from-[#1a3a5c] to-[#1a2a3c] border-b border-border">
          <p className="text-xs text-text-secondary leading-relaxed">
            개인정보 보호법에 의하여 대회정보는 1년간만 보관됩니다.
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            회원 가입을 하면 개인기록을 계속 볼 수 있습니다.
          </p>
        </div>

        {/* Search */}
        <div className="px-5 py-3 relative border-b border-border">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색어 입력..."
            className="w-full px-3.5 py-2.5 pr-10 bg-bg-card border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-red"
          />
          <Search
            size={18}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-text-muted"
          />
        </div>

        {/* Event List */}
        <ul className="list-none">
          {filteredEvents.length === 0 ? (
            <li className="px-5 py-4 text-center text-text-muted text-sm">
              검색 결과가 없습니다.
            </li>
          ) : (
            filteredEvents.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/record/${event.id}`}
                  className="block px-5 py-3.5 border-b border-border text-sm text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
                >
                  <span className="text-text-muted mr-1">
                    ({formatDate(event.date)})
                  </span>
                  {event.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
