import Image from "next/image";
import React from "react";
import RenderTag from "../renderTag";
import Link from "next/link";
import { getTopQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";

async function RightSidebar() {
  const topQuestions = await getTopQuestions();
  const topTags = await getPopularTags();

  return (
    <div
      className="
  background-light900_dark200 light-border flex flex-col    p-6 pt-36 shadow-light-300 dark:shadow-none max-md:hidden md:w-[320px]"
    >
      <div className="mb-20">
        <h2 className="h3-bold text-dark300_light900 ">Top Questions</h2>
        <div className="mt-6 flex flex-col gap-[30px]">
          {topQuestions.map((question) => (
            <Link key={question._id} href={`/question/${question._id}`}>
              <div key={question._id} className="flex gap-4">
                <p className="body-medium text-dark500_light700">
                  {question.title}
                </p>
                <Image
                  alt="chevron right"
                  width={20}
                  height={20}
                  src="/assets/icons/chevron-right.svg"
                  className="cursor-pointer "
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2 className="h3-bold text-dark300_light900 ">Popular Tags</h2>

        <div className="mt-6 flex flex-col gap-[30px]">
          {topTags.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              showCount={true}
              totalQuestions={tag.numberofQuestions}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
