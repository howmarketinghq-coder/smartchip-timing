import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import prisma from "@/lib/prisma";

async function getEvents() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
  });

  return events.map((e) => ({
    ...e,
    courses: JSON.parse(e.courses) as string[],
  }));
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <Header />

      <main className="pt-20 pb-10 px-4 max-w-[520px] mx-auto">
        <h1 className="font-[family-name:var(--font-bebas-neue)] text-4xl text-center tracking-[4px] mb-2 mt-8">
          기록 조회
        </h1>
        <p className="text-center text-text-muted text-sm mb-8">
          대회를 선택하여 기록을 조회하세요
        </p>

        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-center text-text-muted py-10">
              등록된 대회가 없습니다.
            </p>
          ) : (
            events.map((event) => (
              <Link
                key={event.id}
                href={`/record/${event.id}`}
                className="block p-4 bg-bg-secondary border border-border rounded-xl hover:border-accent-red transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-text-primary">
                      {event.name}
                    </h3>
                    <p className="text-sm text-text-muted mt-1">
                      {new Date(event.date).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <div className="text-xs text-text-muted">
                    {event.courses.join(", ")}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
