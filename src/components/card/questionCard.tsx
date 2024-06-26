import Link from "next/link";
import RenderTag from "@/components/shared/renderTag";
import Metric from "@/components/shared/metric";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/editDeleteAction";

interface QuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
    clerkId: string;
  };
  upVotes: string[];
  views: number;
  answers: Array<object>;
  createdAt: Date;
  clerkId?: string | null;
}

const QuestionCard = ({
  clerkId,
  _id,
  title,
  tags,
  author,
  upVotes,
  answers,
  views,
  createdAt,
}: QuestionProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        {/* Date(on mobile) + Title */}
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>

          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>

        {/* Edit / Delete */}
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      {/* Tags */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => {
          return <RenderTag key={tag._id} _id={tag._id} name={tag.name} />;
        })}
      </div>

      <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
        {/* Author */}
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={`- asket ${getTimestamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          {/* Votes */}
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="upVotes"
            value={formatAndDivideNumber(upVotes?.length)}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
          />

          {/* Message */}
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatAndDivideNumber(answers?.length)}
            title="Answers"
            textStyles="small-medium text-dark400_light800"
          />

          {/* Views */}
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDivideNumber(views)}
            title="Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
