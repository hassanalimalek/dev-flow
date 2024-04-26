"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
// import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
// import { toast } from "../ui/use-toast";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upVotes: number;
  hasUpvoted: boolean;
  downVotes: number;
  hasDownvoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upVotes,
  hasUpvoted,
  downVotes,
  hasDownvoted,
  hasSaved,
}: Props) => {
  console.log("itemId -->", itemId);
  console.log(" --userId ", userId);
  const pathname = usePathname();
  const router = useRouter();

  const handleSave = async () => {
    if (!userId) {
      // return toast({
      //   title: "Please log in",
      //   description: "You must be logged in to perform this action",
      // });
    }

    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    });

    // return toast({
    //   title: `Question ${
    //     !hasSaved ? "saved in" : "removed from"
    //   } your collection`,
    //   variant: !hasSaved ? "default" : "destructive",
    // });
  };

  const handleVote = async (action: string) => {
    if (!userId) {
      // return toast({
      //   title: "Please log in",
      //   description: "You must be logged in to perform this action",
      // });
    }

    if (action === "upVote") {
      if (type === "Question") {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        console.log("test voting-->", {
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        });
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        });
      }

      // return toast({
      //   title: `Upvote ${!hasUpvoted ? "Successful" : "Removed"}`,
      //   variant: !hasUpvoted ? "default" : "destructive",
      // });
    }

    if (action === "downVote") {
      if (type === "Question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        });
      }

      // return toast({
      //   title: `Downvote ${!hasDownvoted ? "Successful" : "Removed"}`,
      //   variant: !hasDownvoted ? "default" : "destructive",
      // });
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname, router]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upVote.svg"
            }
            alt={hasUpvoted ? "upVoted" : "upVote"}
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote("upVote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upVotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downVote.svg"
            }
            alt={hasDownvoted ? "downvoted" : "downVote"}
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote("downVote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downVotes)}
            </p>
          </div>
        </div>
      </div>

      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          alt={hasSaved ? "star-filled" : "star-red"}
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};
export default Votes;
