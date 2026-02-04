import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { searchParams } = new URL(request.url);
    const bib = searchParams.get("bib");
    const name = searchParams.get("name");
    const course = searchParams.get("course");

    const where: Record<string, unknown> = { eventId };

    if (bib) {
      where.bib = bib;
    }

    if (name) {
      where.name = { contains: name };
    }

    if (course) {
      where.course = course;
    }

    const records = await prisma.record.findMany({
      where,
      orderBy: { finishTime: "asc" },
    });

    return NextResponse.json(
      records.map((r) => ({
        ...r,
        splits: JSON.parse(r.splits) as Array<{
          distance: string;
          time: string;
          pace: string;
        }>,
      }))
    );
  } catch (error) {
    console.error("Failed to fetch records:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;
    const body = await request.json();
    const { records } = body;

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: "Records array is required" },
        { status: 400 }
      );
    }

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Delete existing records for this event (replace mode)
    await prisma.record.deleteMany({
      where: { eventId },
    });

    // Create new records
    const createdRecords = await prisma.record.createMany({
      data: records.map(
        (r: {
          bib: string;
          name: string;
          course: string;
          gender: string;
          finishTime: string;
          speed: number;
          pace: string;
          splits: Array<{ distance: string; time: string; pace: string }>;
        }) => ({
          eventId,
          bib: r.bib,
          name: r.name,
          course: r.course,
          gender: r.gender,
          finishTime: r.finishTime,
          speed: r.speed,
          pace: r.pace,
          splits: JSON.stringify(r.splits),
        })
      ),
    });

    return NextResponse.json({
      success: true,
      count: createdRecords.count,
    });
  } catch (error) {
    console.error("Failed to upload records:", error);
    return NextResponse.json(
      { error: "Failed to upload records" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;

    await prisma.record.deleteMany({
      where: { eventId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete records:", error);
    return NextResponse.json(
      { error: "Failed to delete records" },
      { status: 500 }
    );
  }
}
