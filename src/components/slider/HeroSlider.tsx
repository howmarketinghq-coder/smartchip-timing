"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Poster } from "@/types";

interface HeroSliderProps {
  posters: Poster[];
}

export default function HeroSlider({ posters }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto slide
  useEffect(() => {
    if (posters.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posters.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posters.length]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < posters.length - 1) {
        goToSlide(currentSlide + 1);
      } else if (diff < 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }
  };

  if (posters.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-bg-card h-[280px] flex items-center justify-center">
        <p className="text-text-muted">등록된 포스터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        ref={sliderRef}
        className="flex transition-transform duration-400 ease-out touch-pan-y"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {posters.map((poster, index) => (
          <div key={poster.id} className="min-w-full flex gap-2 px-1">
            <Link
              href={poster.link || "#"}
              className="flex-[2] rounded-lg overflow-hidden cursor-pointer relative"
            >
              <Image
                src={poster.imageUrl}
                alt={`Poster ${index + 1}`}
                width={600}
                height={400}
                className="w-full h-[280px] object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </Link>
            {posters[index + 1] && (
              <Link
                href={posters[index + 1].link || "#"}
                className="flex-1 rounded-lg overflow-hidden cursor-pointer relative"
              >
                <Image
                  src={posters[index + 1].imageUrl}
                  alt={`Poster ${index + 2}`}
                  width={300}
                  height={400}
                  className="w-full h-[280px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4 py-2">
        {posters.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all cursor-pointer",
              currentSlide === index
                ? "bg-text-primary scale-125"
                : "bg-text-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
}
