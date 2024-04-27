"use server";

import Question from "@/database/question.modal";
import Answer from "@/database/answer.modal";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.modal";
import User from "@/database/user.modal";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  QuestionVoteParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.modal";

export async function createQuestion(params: CreateQuestionParams) {
  console.log("create question start @@@2");
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();
    console.log("params received @@@ ", params);
    const { title, content, tags, author, path } = params;
    // Create the question
    console.log("tags --->", tags);
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];
    console.log("tags -->", tags);
    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag);
    }
    console.log("tagDocuments --->", tagDocuments);
    await Question.findByIdAndUpdate(question._id, { tags: tagDocuments });

    revalidatePath(path);
  } catch (e) {
    throw e;
  }
}

export async function getQuestionById(id: string) {
  // eslint-disable-next-line no-useless-catch

  try {
    if (id) {
      connectToDatabase();
      return await Question.findById(id)
        .populate("tags", { modal: Tag })
        .populate("author", { modal: User });
    }
  } catch (e) {
    console.log("error in getQuestionById", e);
    throw e;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, path } = params;
    console.log("params -->", params);
    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );
    console.log("question deleted @@@");
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestions() {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();
    return await Question.find()
      .populate("tags", { modal: Tag })
      .populate("author", { modal: User })
      .sort({ createdAt: -1 });
  } catch (e) {
    throw e;
  }
}
export async function getUserQuestions(params) {
  const { userId, sortBy, page = 1, pageSize = 10 } = params;

  // for Pagination => calculate the number of posts to skip based on the pageNumber and pageSize
  const skipAmount = (page - 1) * pageSize;

  try {
    connectToDatabase();
    return await Question.find({ author: userId })
      .sort({ views: -1, upVotes: -1 })
      .populate("tags", { modal: Tag })
      .populate("author", { modal: User })
      .skip(skipAmount)
      .limit(pageSize);
  } catch (e) {
    console.log("e -->", e);
    throw e;
  }
}


export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

    let updateQuery = {};

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
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

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
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