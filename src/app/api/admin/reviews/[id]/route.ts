import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id: idStr } = await ctx.params;
    const id = parseInt(idStr);
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error", error: (error as Error).message }, { status: 500 });
  }
}
