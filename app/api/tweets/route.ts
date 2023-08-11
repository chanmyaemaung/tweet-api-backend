import { NextResponse } from "next/server";
import prisma from "~/prisma";
import { connectDB } from "~/utils";

export const GET = async (req: Request) => {
  try {
    await connectDB();

    const userInfo = await prisma.user.findMany({
      select: {
        name: true,
        tweets: true,
        _count: true,
      },
    });

    return NextResponse.json({ tweets: userInfo }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request) => {
  try {
    const { tweet, userId } = await req.json();

    if (!tweet && !userId)
      return NextResponse.json(
        { message: "Invalid credentials!" },
        { status: 422 }
      );

    await connectDB();

    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 401 });

    const newTweet = await prisma.tweets.create({
      data: {
        userId,
        tweet,
      },
      select: {
        id: true,
        tweet: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ tweet: newTweet }, { status: 201 });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
