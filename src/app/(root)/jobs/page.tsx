import JobCard from "@/components/card/jobCard";
import Filters from "@/components/shared/filter";
import NoResult from "@/components/shared/noResult";
import { LocalSearchBar } from "@/components/shared/search/localSearchBar";
import { getJobCountries, getJobs } from "@/lib/actions/job.action";
import React from "react";

async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams?.q;

  const filter = searchParams?.filter;
  const jobs = await getJobs({ query, filter });
  const jobCountries = await getJobCountries();

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/jobs"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Job, Title, Company or keywords"
          otherClasses="flex-1"
        />
        <Filters
          filters={[
            { name: "All", value: "all" },
            ...jobCountries?.map((country) => ({
              name: country,
              value: country,
            })),
          ]}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {jobs?.length > 0 ? (
          jobs.map((job) => {
            return <JobCard job={job} key={job?.id} />;
          })
        ) : (
          <NoResult title="No Jobs Available" />
        )}
      </div>
    </>
  );
}

export default Page;
