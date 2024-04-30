import UserCard from "@/components/card/userCard";
import Filters from "@/components/shared/filter";
import Pagination from "@/components/shared/pagination";
import { LocalSearchBar } from "@/components/shared/search/localSearchBar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import React from "react";

export default async function Community({
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams?.q;
  const filter = searchParams?.filter;
  const page = searchParams?.page;

  const { users, isNext } = await getAllUsers({
    searchKey: query,
    filter,
    page,
  });

  return (
    <div>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search amazing minds here..."
          otherClasses="flex-1"
        />
        <Filters
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          // containerClasses="hidden max-md:flex"
        />
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        {users.length > 0 ? (
          users.map((user: any) => <UserCard user={user} key={user._id} />)
        ) : (
          <div>No users found</div>
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </div>
  );
}

