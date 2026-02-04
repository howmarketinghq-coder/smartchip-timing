import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RecordSearchClient from "./RecordSearchClient";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

async function getEvent(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) return null;

  return {
    ...event,
    courses: JSON.parse(event.courses) as string[],
  };
}

export default async function RecordSearchPage({ params }: PageProps) {
  const { eventId } = await params;
  const event = await getEvent(eventId);

  if (!event) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="pt-20 pb-10 px-4 max-w-[520px] mx-auto min-h-[80vh] text-center">
        {/* Search Icon */}
        <div className="w-[120px] h-[120px] mx-auto mt-10 mb-8 text-text-muted opacity-30">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="40" cy="40" r="30" />
            <line x1="62" y1="62" x2="90" y2="90" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>

        {/* Event Title */}
        <h1 className="text-2xl font-bold mb-8">{event.name}</h1>

        {/* Search Form */}
        <RecordSearchClient eventId={eventId} eventName={event.name} />

        {/* Notice */}
        <div className="max-w-[360px] mx-auto mt-10">
          <p className="text-accent-red text-sm font-bold mb-4">| 보다 정확한 기록을 위한 안내사항 |</p>
          <div className="flex items-start gap-3 mb-3 text-left">
            <span className="text-text-muted text-xl shrink-0 mt-0.5">📶</span>
            <p className="text-xs text-text-secondary leading-relaxed">
              은박담요는 통신을 차단하여 기록이 잘 나오지 못하게 합니다.
            </p>
          </div>
          <div className="flex items-start gap-3 mb-3 text-left">
            <span className="text-text-muted text-xl shrink-0 mt-0.5">📱</span>
            <p className="text-xs text-text-secondary leading-relaxed">
              통신기기가 칩과 겹쳐있으면 기록이 잘 나오지 않습니다.
            </p>
          </div>
          <div className="flex items-start gap-3 mb-3 text-left">
            <span className="text-text-muted text-xl shrink-0 mt-0.5">🔋</span>
            <p className="text-xs text-text-secondary leading-relaxed">
              수분(에너지젤 등)이 칩과 겹쳐있으면 통신을 방해합니다.
            </p>
          </div>
          <p className="mt-10 text-xs text-text-muted">스마트칩은 여러분의 도전을 응원합니다</p>
        </div>
      </main>

      <Footer />
    </>
  );
}
