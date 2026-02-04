import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const query = searchParams.get("query");

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 }
      );
    }

    const whereClause: {
      eventId: string;
      OR?: Array<{ bib: { contains: string } } | { name: { contains: string } }>;
    } = { eventId };

    if (query) {
      whereClause.OR = [
        { bib: { contains: query } },
        { name: { contains: query } },
      ];
    }

    const records = await prisma.record.findMany({
      where: whereClause,
      orderBy: { finishTime: "asc" },
    });

    const formattedRecords = records.map((record) => ({
      ...record,
      splits: JSON.parse(record.splits),
    }));

    return NextResponse.json(formattedRecords);
  } catch (error) {
    console.error("Failed to fetch records:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}
