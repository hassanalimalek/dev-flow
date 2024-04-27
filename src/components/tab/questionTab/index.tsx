import QuestionCard from "@/components/card/questionCard";
import NoResult from "@/components/shared/noResult";
import { getUserQuestions } from "@/lib/actions/question.action";
import React from "react";

interface IndexProps {
  userId: string;
  clerkId: string;
  searchParams: any;
}

async function Index({ userId, clerkId, searchParams }: IndexProps) {
  const questions = await getUserQuestions({ userId });
  return (
    <div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              clerkId={clerkId}
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              answers={question.answers}
              upVotes={question.upVotes}
              views={question.views}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </div>
    </div>
  );
}

export default Index;
