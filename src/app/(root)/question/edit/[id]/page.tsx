import Question from "@/components/forms/questions";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";

async function Page({ params }: any) {
  const { userId } = auth();
  const { id } = params;

  const mongoUser = await getUserById({ userId: userId! as string });
  const questionDetail = await getQuestionById(id);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 mb-4">Edit question</h1>
      <Question
        mongoUserId={JSON.stringify(mongoUser)}
        type="edit"
        questionDetails={JSON.stringify(questionDetail)}
      />
    </div>
  );
}

export default Page;
