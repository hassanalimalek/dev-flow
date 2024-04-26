import Question from "@/components/forms/questions";
// import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";

function Page() {
  // const { userId } = auth();
  // console.log("userId @@@@@@", userId);
  const userId = "ABC123";
  console.log("user id -->", userId);
  // const mongoUser = await getUserById({ userId });
  // console.log("mongo user -->", mongoUser);
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 mb-4">Ask a question</h1>
      <Question mongoUserId={userId} />
    </div>
  );
}

export default Page;
