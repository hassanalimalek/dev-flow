import Question from "@/components/forms/questions";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask a Question | DevOverFlow",
};

async function Page() {
  const { userId } = auth();
  const mongoUser = await getUserById({ userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 mb-4">Ask a question</h1>
      <Question mongoUserId={JSON.stringify(mongoUser)} />
    </div>
  );
}

export default Page;
