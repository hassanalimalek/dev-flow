import AnswerCard from "@/components/card/answerCard";
import NoResult from "@/components/shared/noResult";
import { getUserAnswers } from "@/lib/actions/answer.action";
import React from "react";

interface IndexProps {
  userId: string;
  clerkId: string;
  searchParams: any;
}

async function AnswerTab({ userId, clerkId, searchParams }: IndexProps) {
  const answers = await getUserAnswers({ userId });
  return (
    <div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {answers && answers.length > 0 ? (
          answers.map((answer) => (
            <AnswerCard
              key={answer._id}
              clerkId={clerkId}
              _id={answer._id}
              question={answer.question}
              author={answer.author}
              upVotes={answer.upVotes.length}
              createdAt={answer.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no answer to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </div>
    </div>
  );
}

export default AnswerTab;
