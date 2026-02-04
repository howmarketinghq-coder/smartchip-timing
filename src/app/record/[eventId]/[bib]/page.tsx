import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RecordResultClient from "./RecordResultClient";

interface PageProps {
  params: Promise<{ eventId: string; bib: string }>;
}

async function getRecordData(eventId: string, bib: string) {
  const [event, record] = await Promise.all([
    prisma.event.findUnique({ where: { id: eventId } }),
    prisma.record.findUnique({
      where: { eventId_bib: { eventId, bib } },
    }),
  ]);

  if (!event || !record) return null;

  // Get all records for ranking calculation
  const allRecords = await prisma.record.findMany({
    where: { eventId },
    orderBy: { finishTime: "asc" },
  });

  return {
    event: {
      ...event,
      courses: JSON.parse(event.courses) as string[],
      status: event.status as "upcoming" | "active" | "past",
    },
    record: {
      ...record,
      splits: JSON.parse(record.splits),
      gender: record.gender as "M" | "F",
    },
    allRecords: allRecords.map((r) => ({
      ...r,
      splits: JSON.parse(r.splits),
      gender: r.gender as "M" | "F",
    })),
  };
}

export default async function RecordResultPage({ params }: PageProps) {
  const { eventId, bib } = await params;
  const data = await getRecordData(eventId, bib);

  if (!data) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="pt-20 pb-10 px-4 max-w-[520px] mx-auto">
        <RecordResultClient
          event={data.event}
          record={data.record}
          allRecords={data.allRecords}
        />
      </main>

      <Footer />
    </>
  );
}
