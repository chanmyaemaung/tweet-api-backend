import { NextResponse } from "next/server";
import prisma from "~/prisma";
import { connectDB } from "~/utils";

export const GET = async (
  req: Request,
  { params }: { params: { tweetId: string } }
) => {
  try {
    await connectDB();

    const tweet = await prisma.tweets.findFirst({
      where: {
        id: params.tweetId,
      },
    });

    return NextResponse.json({ tweet }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { tweetId: string } }
) => {
  try {
    const { tweet } = await req.json();

    await connectDB();

    const updatedTweet = await prisma.tweets.update({
      data: { tweet },
      where: { id: params.tweetId },
    });

    return NextResponse.json({ tweet: updatedTweet }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { tweetId: string } }
) => {
  try {
    await connectDB();

    const tweet = await prisma.tweets.delete({
      where: { id: params.tweetId },
    });

    return NextResponse.json(
      { message: "Successfully deleted!", tweet },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
