"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import type { Record } from "@/types";

interface RecordSearchClientProps {
  eventId: string;
  eventName: string;
}

export default function RecordSearchClient({ eventId }: RecordSearchClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Record[] | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      showToast("배번호 또는 이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      const res = await fetch(`/api/records?eventId=${eventId}&query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.length === 0) {
        setResults([]);
      } else if (data.length === 1) {
        // Single result - redirect to record page
        router.push(`/record/${eventId}/${data[0].bib}`);
        return;
      } else {
        setResults(data);
      }
    } catch {
      showToast("검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* Search Input */}
      <div className="flex gap-0 max-w-[360px] mx-auto mb-10 overflow-hidden rounded-lg border-2 border-border-light">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="배번호 or 이름"
          autoFocus
          autoComplete="off"
          className="flex-1 px-4 py-3.5 bg-bg-secondary text-text-primary text-base placeholder:text-text-muted focus:outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-5 py-3.5 bg-accent-red text-white cursor-pointer flex items-center justify-center transition-colors hover:bg-accent-red-dark disabled:opacity-50"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-10">
          <Spinner text="검색 중..." />
        </div>
      )}

      {/* Results */}
      {results !== null && !isLoading && (
        <div className="max-w-[360px] mx-auto">
          {results.length === 0 ? (
            <div className="py-8 text-center">
              <span className="text-4xl mb-3 block">🙅</span>
              <p className="text-text-secondary">검색 결과가 없습니다.</p>
              <p className="text-xs text-text-muted mt-2">배번호 또는 이름을 다시 확인해주세요.</p>
            </div>
          ) : (
            <ul className="border border-border rounded-lg overflow-hidden">
              {results.map((record) => (
                <li
                  key={record.id}
                  onClick={() => router.push(`/record/${eventId}/${record.bib}`)}
                  className="flex justify-between items-center px-5 py-3.5 border-b border-border last:border-b-0 cursor-pointer transition-colors hover:bg-bg-card"
                >
                  <div>
                    <strong className="text-text-primary">{record.name}</strong>
                    <span className="text-text-muted ml-2">BIB {record.bib}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-text-secondary text-xs">{record.course}</span>
                    <span className="text-accent-green ml-2 font-[family-name:var(--font-bebas-neue)] text-base">
                      {record.finishTime}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
