
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const data = await req.json();
  const trade = await prisma.trade.update({ where: { id }, data });
  return NextResponse.json(trade);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.trade.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
