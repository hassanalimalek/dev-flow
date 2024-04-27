import AnswerForm from "@/components/forms/answer";
import AllAnswers from "@/components/shared/allAnswers";
import Metric from "@/components/shared/metric";
import ParseHTML from "@/components/shared/parseHtml";
import RenderTag from "@/components/shared/renderTag";
import Votes from "@/components/shared/votes";
import { getAnswers } from "@/lib/actions/answer.action";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

async function Page({ params }: any) {
  console.log("params -->", params);

  const { id } = params;
  const { userId } = auth();
  const result = await getQuestionById(id);
  const { answers } = await getAnswers({ questionId: id });
  let mongoUser;
  if (userId) {
    mongoUser = await getUserById({ userId });
  }

  console.log("result 0000", result);
  console.log("result?._id -->", result?._id);
  console.log("answers -->", answers);
  console.log("userId -->", userId);
  console.log("mongoUser -->", mongoUser);
  console.log("userId @@@", userId);
  console.log("id -->", id);

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result?.author?.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result?.author?.picture}
              alt={result?.author?.name}
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result?.author?.name}
            </p>
          </Link>

          <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser?._id)}
              upVotes={result.upVotes.length}
              hasUpvoted={result.upVotes.includes(mongoUser?._id)}
              downVotes={result.downVotes.length}
              hasDownvoted={result.downVotes.includes(mongoUser?._id)}
              hasSaved={mongoUser?.saved.includes(result._id)}
            />
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result?.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        {/* Votes */}
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(result?.createdAt)}`}
          title="Asked"
          textStyles="small-medium text-dark400_light800"
        />

        {/* Message */}
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(result?.answers.length)}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />

        {/* Views */}
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(result?.views) || 0}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      {/* Question content */}
      <ParseHTML data={result?.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {result?.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>
      <AllAnswers
        answers={answers}
        totalAnswers={result?.answers.length}
        userId={JSON.stringify(mongoUser?._id)}
        questionId={JSON.stringify(result?._id)}
      />
      <AnswerForm
        question={result?.content}
        questionId={JSON.stringify(result?._id)}
        mongoUserId={JSON.stringify(mongoUser?._id)}
      />
    </>
  );
}

export default Page;
