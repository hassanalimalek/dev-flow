// "use client";
import QuestionCard from "@/components/card";
import HomeFilters from "@/components/home/homeFilters";
import Filters from "@/components/shared/filter";
import NoResult from "@/components/shared/noResult";
import { LocalSearchBar } from "@/components/shared/search/localSearchBar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import React from "react";
import { auth } from "@clerk/nextjs";
import Pagination from "@/components/shared/pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Questions | DevOverFlow",
};

export default async function Collection({
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth();
  const query = searchParams?.q;
  const filter = searchParams?.filter;
  const page = searchParams?.page;

  if (!userId) return null;

  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery: query,
    filter: filter as string,
    page: page ? Number(page) : 1,
  });

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filters
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        ></Filters>
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
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
        <div className="mt-10">
          <Pagination
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext={result?.isNext}
          />
        </div>
      </div>
    </>
  );
}
