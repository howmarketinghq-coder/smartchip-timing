import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
      include: {
        _count: {
          select: { records: true },
        },
      },
    });

    const formattedEvents = events.map((event) => ({
      ...event,
      courses: JSON.parse(event.courses),
      recordCount: event._count.records,
    }));

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, date, courses, status, siteUrl } = body;

    const event = await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        courses: JSON.stringify(courses),
        status: status || "upcoming",
        siteUrl,
      },
    });

    return NextResponse.json({
      ...event,
      courses: JSON.parse(event.courses),
    });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
