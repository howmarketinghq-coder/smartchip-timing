import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/slider/HeroSlider";
import EventSlider from "@/components/slider/EventSlider";
import PastEventDropdown from "@/components/slider/PastEventDropdown";
import prisma from "@/lib/prisma";
import type { Poster, Event } from "@/types";

async function getHomeData() {
  const [heroPostersRaw, nextPostersRaw, eventsRaw] = await Promise.all([
    prisma.poster.findMany({
      where: { type: "hero" },
      orderBy: { order: "asc" },
    }),
    prisma.poster.findMany({
      where: { type: "next" },
      orderBy: { order: "asc" },
    }),
    prisma.event.findMany({
      where: { status: "past" },
      orderBy: { date: "desc" },
      take: 20,
    }),
  ]);

  const heroPosters: Poster[] = heroPostersRaw.map((p) => ({
    ...p,
    type: p.type as "hero" | "next",
  }));

  const nextPosters: Poster[] = nextPostersRaw.map((p) => ({
    ...p,
    type: p.type as "hero" | "next",
  }));

  const events: Event[] = eventsRaw.map((e) => ({
    ...e,
    courses: JSON.parse(e.courses) as string[],
    status: e.status as "upcoming" | "active" | "past",
  }));

  return { heroPosters, nextPosters, events };
}

export default async function HomePage() {
  const { heroPosters, nextPosters, events } = await getHomeData();

  return (
    <>
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="px-4 py-10 max-w-[520px] mx-auto">
          <h1 className="font-[family-name:var(--font-bebas-neue)] text-4xl text-center tracking-[4px] mb-2">
            CLICK YOUR EVENT
          </h1>
          <p className="text-center text-text-muted text-sm mb-6">
            옆으로 슬라이드하여 대회를 찾으세요
          </p>
          <HeroSlider posters={heroPosters} />
        </section>

        {/* Next Event Section */}
        <section className="px-4 py-10 max-w-[520px] mx-auto">
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl text-center tracking-[4px] mb-2">
            NEXT EVENT
          </h2>
          <Link
            href="#"
            className="block w-fit mx-auto mb-6 px-6 py-2 border border-border-light rounded-[20px] text-text-secondary text-sm transition-colors hover:border-text-primary hover:text-text-primary"
          >
            대회 사이트로 이동
          </Link>
          <EventSlider posters={nextPosters} />
        </section>

        {/* Past Event Section */}
        <section className="px-4 py-10 pb-16 max-w-[520px] mx-auto">
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl text-center tracking-[4px] mb-6">
            PAST EVENT
          </h2>
          <PastEventDropdown events={events} />
        </section>
      </main>

      <Footer />
    </>
  );
}
