"use server";

import Answer from "@/database/answer.modal";
import Question from "@/database/question.modal";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "./shared.types";

import { revalidatePath } from "next/cache";
import User from "@/database/user.modal";
import Interaction from "@/database/interaction.modal";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({ content, author, question });

    // Add the answer to the question's answers array
    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // Increment user reputation
    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: newAnswer.id,
      tags: questionObject.tags,
    });

    // Increment author's reputation
    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}
export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId, sortBy, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};

    switch (sortBy) {
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      case "highestupvotes":
        sortOptions = { upVotes: -1 };
        break;
      case "lowestupvotes":
        sortOptions = { upVotes: 1 };
        break;
      default:
        break;
    }
    console.log("sortOptions -->", sortOptions);

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture ")
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalAnswers = await Answer.countDocuments({
      question: questionId,
    });

    const isNext = totalAnswers > skipAmount + answers.length;

    return { answers, isNext };
  } catch (error) {
    console.log(error);
  }
}
export async function getUserAnswers(params: any) {
  const { userId, sortBy, page = 1, pageSize = 10 } = params;
  console.log("userId -->", userId);
  // for Pagination => calculate the number of posts to skip based on the pageNumber and pageSize
  const skipAmount = (page - 1) * pageSize;

  try {
    connectToDatabase();
    return await Answer.find({ author: userId })
      .sort({ views: -1, upVotes: -1 })
      .populate("upVotes", { modal: User })
      .populate("downVotes", { modal: User })
      .populate("question", { modal: Question })
      .populate("author", { modal: User })
      .skip(skipAmount)
      .limit(pageSize);
  } catch (e) {
    console.log("e -->", e);
    throw e;
  }
}
export async function deleteAnswer({
  answerId,
  path,
}: {
  answerId: string;
  path: string;
}) {
  console.log(" delete answer @@@@@@id -->", answerId);
  console.log(" path -->", path);
  try {
    connectToDatabase();
    await Answer.deleteOne({ _id: answerId.toString() });
    revalidatePath(path);
    return;
  } catch (e) {
    throw e;
  }
}
export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;
    console.log("answerId --->", answerId);
    let updateQuery = {};
    console.log("hasUpvoted -->", hasUpvoted);
    if (hasUpvoted) {
      updateQuery = { $pull: { upVotes: userId } };
    } else if (hasDownvoted) {
      updateQuery = {
        $pull: { downVotes: userId },
        $push: { upVotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upVotes: userId } };
    }

    const question = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error(`❌ Question not found ❌`);
    }

    // Increment author's reputation by +1/-1 for
    // upvoting/revoking an upvote to the question
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpvoted ? -1 : 1 },
    });

    // Increment author's reputation by +10/-10 for
    // recieving an upvote/downvote to the question
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasUpvoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;

    let updateQuery = {};

    if (hasDownvoted) {
      updateQuery = { $pull: { downvoteQuestion: userId } };
    } else if (hasUpvoted) {
      updateQuery = {
        $pull: { upVotes: userId },
        $push: { downVotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downVotes: userId } };
    }

    const question = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error(`❌ Question not found ❌`);
    }

    // Decrement author's reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownvoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasDownvoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}
