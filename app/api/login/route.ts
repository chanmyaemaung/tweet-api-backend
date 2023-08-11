import { NextResponse } from "next/server";
import prisma from "~/prisma";
import { connectDB } from "~/utils";
import { compare, hash } from "bcrypt";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    const hashedPassword = await hash(password, 10);

    if (!email && !password)
      return NextResponse.json({ error: "Missing fields!" }, { status: 422 });

    await connectDB();

    const existingUser = await prisma.user.findFirst({ where: { email } });

    if (!existingUser)
      return NextResponse.json({ error: "User not found!" }, { status: 404 });

    const isPasswordCorrect = await compare(password, existingUser.password);

    if (!isPasswordCorrect)
      return NextResponse.json(
        { error: "Invalid credentials!" },
        { status: 401 }
      );

    return NextResponse.json(
      { user: { name: existingUser.name, id: existingUser.id } },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
