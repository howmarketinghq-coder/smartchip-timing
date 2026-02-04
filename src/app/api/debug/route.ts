import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Check database connection
    const adminCount = await prisma.admin.count();

    // Get admin (without exposing full password)
    const admin = await prisma.admin.findUnique({
      where: { username: "admin" },
    });

    // Test bcrypt compare with expected password
    let passwordTest = null;
    if (admin) {
      passwordTest = await bcrypt.compare("smartchip2026", admin.password);
    }

    return NextResponse.json({
      dbConnected: true,
      adminCount,
      adminExists: !!admin,
      adminId: admin?.id,
      adminUsername: admin?.username,
      passwordHashLength: admin?.password?.length,
      passwordHashStart: admin?.password?.substring(0, 10),
      passwordTestResult: passwordTest,
    });
  } catch (error) {
    return NextResponse.json({
      dbConnected: false,
      error: String(error),
    }, { status: 500 });
  }
}
