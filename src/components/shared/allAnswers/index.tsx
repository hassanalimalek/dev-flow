import { AnswerFilters } from "@/constants/filters";
import Filter from "../filter";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "../parseHtml";
import Votes from "../votes";
import Pagination from "../pagination";
// import Pagination from './Pagination';

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) => {
  const result = await getAnswers({
    questionId: JSON.parse(questionId),
    page: page ? +page : 1,
    sortBy: filter,
  });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {result &&
          result.answers.map((answer) => (
            <article key={answer._id} className="light-border border-b py-10">
              <div className="mb-8 flex w-full justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    alt="profile"
                    width={18}
                    height={18}
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}
                    </p>

                    <p className="small-regular text-light400_light500 ml-1 mt-0.5 line-clamp-1">
                      - answered {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>

                <div className="flex justify-end">
                  <Votes
                    type="Answer"
                    itemId={JSON.stringify(answer._id)}
                    userId={userId}
                    upVotes={answer.upVotes.length}
                    hasUpvoted={
                      userId && answer.upVotes.includes(JSON.parse(userId))
                    }
                    downVotes={answer.downVotes.length}
                    hasDownvoted={
                      userId && answer.downVotes.includes(JSON.parse(userId))
                    }
                  />
                </div>
              </div>

              <ParseHTML data={answer.content} />
            </article>
          ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 w-full">
        <Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
      </div>
    </div>
  );
};
export default AllAnswers;
