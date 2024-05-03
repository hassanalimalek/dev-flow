import QuestionCard from "@/components/card";
import HomeFilters from "@/components/home/homeFilters";
import Filters from "@/components/shared/filter";
import NoResult from "@/components/shared/noResult";
import { LocalSearchBar } from "@/components/shared/search/localSearchBar";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/shared/pagination";
import { HomePageFilters } from "@/constants/filters";
import {
  getQuestions,
  getRecommendedQuestions,
} from "@/lib/actions/question.action";
import Link from "next/link";
import React from "react";
import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | DevOverFlow",
};

export default async function Home({
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth();

  const filter = searchParams?.filter;
  const query = searchParams?.q;
  const page = searchParams?.page;
  let result;
  if (searchParams?.filter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: query as string,
        page: page ? +page : 1,
      });
    } else {
      result = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    result = await getQuestions({
      searchQuery: query,
      filter,
      page: page ? +page : 1,
    });
  }

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link
          href="/ask-question"
          className="flex
justify-end max-sm:w-full"
        >
          <Button
            className="primary-gradient min-h-[46px]
px-4 py-3 !text-light-900"
          >
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filters
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        ></Filters>
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
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
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result?.isNext}
        />
      </div>
    </>
  );
}
