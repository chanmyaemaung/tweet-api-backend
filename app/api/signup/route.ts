import { NextResponse } from "next/server";
import prisma from "~/prisma";
import { connectDB } from "~/utils";
import { hash } from "bcrypt";

export const POST = async (req: Request) => {
  try {
    const { name, email, password } = await req.json();

    const hashedPassword = await hash(password, 10);

    if (!name || !email || !password)
      return NextResponse.json({ error: "Missing fields" }, { status: 422 });

    await connectDB();

    const isUserExisting = await prisma.user.findFirst({ where: { email } });

    if (isUserExisting)
      return NextResponse.json({ error: "User exists!" }, { status: 409 });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
