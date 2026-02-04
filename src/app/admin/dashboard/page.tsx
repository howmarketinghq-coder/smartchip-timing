import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

async function getAdminData() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: {
      _count: {
        select: { records: true },
      },
    },
  });

  return {
    events: events.map((e) => ({
      ...e,
      courses: JSON.parse(e.courses) as string[],
      recordCount: e._count.records,
    })),
  };
}

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const { events } = await getAdminData();

  return <AdminDashboardClient events={events} />;
}
