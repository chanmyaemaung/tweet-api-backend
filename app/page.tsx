import prisma from "~/prisma";

export default async function Home() {
  const tweets = await prisma.tweets.findMany({
    include: {
      User: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return (
    <>
      <pre>{JSON.stringify(tweets, null, 2)}</pre>
    </>
  );
}
