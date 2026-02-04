"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Poster } from "@/types";

interface EventSliderProps {
  posters: Poster[];
  itemsPerGroup?: number;
}

export default function EventSlider({ posters, itemsPerGroup = 3 }: EventSliderProps) {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const totalGroups = Math.ceil(posters.length / itemsPerGroup);

  // Auto slide
  useEffect(() => {
    if (totalGroups <= 1) return;
    const interval = setInterval(() => {
      setCurrentGroup((prev) => (prev + 1) % totalGroups);
    }, 4000);
    return () => clearInterval(interval);
  }, [totalGroups]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentGroup < totalGroups - 1) {
        setCurrentGroup(currentGroup + 1);
      } else if (diff < 0 && currentGroup > 0) {
        setCurrentGroup(currentGroup - 1);
      }
    }
  };

  if (posters.length === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center bg-bg-card rounded-lg">
        <p className="text-text-muted">등록된 이벤트가 없습니다</p>
      </div>
    );
  }

  // Group posters
  const groups: Poster[][] = [];
  for (let i = 0; i < totalGroups; i++) {
    groups.push(posters.slice(i * itemsPerGroup, (i + 1) * itemsPerGroup));
  }

  return (
    <div className="overflow-hidden">
      <div
        ref={sliderRef}
        className="flex transition-transform duration-400 ease-out touch-pan-y"
        style={{ transform: `translateX(-${currentGroup * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="min-w-full flex gap-2 px-1">
            {group.map((poster) => (
              <Link
                key={poster.id}
                href={poster.link || "#"}
                className="flex-1 rounded-lg overflow-hidden cursor-pointer relative transition-transform hover:-translate-y-1"
              >
                <Image
                  src={poster.imageUrl}
                  alt="Event poster"
                  width={300}
                  height={240}
                  className="w-full h-[180px] object-cover"
                />
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Dots */}
      {totalGroups > 1 && (
        <div className="flex justify-center gap-2 mt-4 py-2">
          {Array.from({ length: totalGroups }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentGroup(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all cursor-pointer",
                currentGroup === index
                  ? "bg-text-primary scale-125"
                  : "bg-text-muted"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
