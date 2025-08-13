
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const trades = await prisma.trade.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(trades);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const trade = await prisma.trade.create({ data: body });
  return NextResponse.json(trade, { status: 201 });
}
