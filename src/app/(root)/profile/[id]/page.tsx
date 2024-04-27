import ProfileCardHeader from "@/components/card/profileHeaderCard";
import StatBadgeCard from "@/components/card/statBadgeCard";
import StatCard from "@/components/card/statCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserInfo } from "@/lib/actions/user.action";
import React from "react";
import QuestionTab from "@/components/tab/questionTab";
import AnswerTab from "@/components/tab/answerTab";

async function Page({ params, searchParams }: any) {
  const { id } = params;
  const userData = await getUserInfo({ userId: id });
  console.log("userData -->", userData);

  return (
    <div
      className="flex flex-col flex-1   justify-between
    "
    >
      <div className="m">
        <ProfileCardHeader data={userData} />
      </div>
      <div>
        <h4 className="font-semibold mt-8 mb-4">Stats</h4>
        <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          <StatCard
            data={[
              { title: "Questions", value: "123" },
              { title: "Answers", value: "123" },
            ]}
          />
          <StatBadgeCard
            image="/assets/icons/gold-medal.svg"
            title="Gold"
            value="123"
          />
          <StatBadgeCard
            image="/assets/icons/silver-medal.svg"
            title="Silver"
            value="123"
          />
          <StatBadgeCard
            image="/assets/icons/bronze-medal.svg"
            title="Bronze"
            value="123"
          />
        </div>
      </div>

      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="questions" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="questions" className="tab">
              Questions
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="questions">
            <QuestionTab
              clerkId={id}
              userId={userData.user._id}
              // searchParams={}
            />
          </TabsContent>
          <TabsContent value="answers">
            <AnswerTab clerkId={id} userId={userData.user._id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Page;
