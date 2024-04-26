import UserCard from "@/components/card/userCard";
import Filters from "@/components/shared/filter";
import LocalSearchbar from "@/components/shared/search/localSearch";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import React from "react";

async function Page() {
  const result = await getAllUsers();
  return (
    <div>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search amazing minds here..."
          otherClasses="flex-1"
        />
        <Filters
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        ></Filters>
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        {result.length > 0 ? (
          result.map((user) => <UserCard user={user} key={user._id} />)
        ) : (
          <div>No users found</div>
        )}
      </div>
    </div>
  );
}

export default Page;
