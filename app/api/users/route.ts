import { NextResponse } from "next/server";
import prisma from "~/prisma";
import { connectDB } from "~/utils";

export const GET = async (req: Request) => {
  try {
    await connectDB();

    const users = await prisma.user.findMany({});

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
