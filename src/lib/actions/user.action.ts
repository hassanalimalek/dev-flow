"use server";

import User from "@/database/user.modal";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.modal";
import {
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { FilterQuery } from "mongoose";
import Tag from "@/database/tag.modal";
import Answer from "@/database/answer.modal";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export const getUserById = async (params: GetUserByIdParams) => {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();

    const { userId } = params;
    console.log("userId received -->", userId);
    const user = await User.findOne({ clerkId: userId });
    console.log("user ---->>>>", user);
    return user;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
};

export const getUserInfo = async (params: GetUserByIdParams) => {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    const totalQuestions = await Question.countDocuments({ author: user?._id });
    const totalAnswers = await Answer.countDocuments({
      author: user?._id,
    });

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user?._id } },
      {
        $project: {
          _id: 0,
          upVotes: { $size: "$upVotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upVotes" },
        },
      },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user?._id } },
      {
        $project: {
          _id: 0,
          upVotes: { $size: "$upVotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upVotes" },
        },
      },
    ]);

    const [questionViews] = await Question.aggregate([
      { $match: { author: user?._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const criteria = [
      {
        type: "QUESTION_COUNT" as BadgeCriteriaType,
        count: totalQuestions,
      },
      {
        type: "ANSWER_COUNT" as BadgeCriteriaType,
        count: totalAnswers,
      },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return { user, totalQuestions, totalAnswers, badgeCounts };
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
};

export const getAllUsers = async (params: any = {}) => {
  // eslint-disable-next-line no-useless-catch

  const { page = 1, pageSize = 10, filter, searchKey } = params;

  // Calculate the number of posts to skip based on the page
  const skipAmount = (page - 1) * pageSize;
  const query: FilterQuery<typeof User> = {};
  if (searchKey) {
    query.$or = [
      { name: { $regex: new RegExp(searchKey, "i") } },
      { username: { $regex: new RegExp(searchKey, "i") } },
      { email: { $regex: new RegExp(searchKey, "i") } },
    ];
  }

  let sortOptions = {};
  switch (filter) {
    case "old_users":
      sortOptions = { joinedAt: 1 };
      break;
    case "new_users":
      sortOptions = { joinedAt: -1 };
      break;
    case "top_contributors":
      sortOptions = { $reputation: -1 };
      break;
    default:
      break;
  }

  try {
    connectToDatabase();
    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await User.countDocuments();
    const isNext = totalUsers > skipAmount + users.length;
    return { users, isNext };
    return users;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
};

export const getUserTopTags = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();

    const users = await User.find();
    return users;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
};

export const createUser = async (params: any) => {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();
    console.log("create user called @@@@", params);
    const { clerkId, name, username, email, picture } = params;

    const user = await User.create({
      clerkId,
      name,
      username,
      email,
      picture,
    });

    return user;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
};

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true, // new instance of that user
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export const deleteUser = async (params: any) => {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();

    const { clerkId } = params;
    console.log("delete user called @@@ ");

    const user: any = User.findOneAndDelete({ clerkId });
    if (!user) throw new Error("User not found");

    // Delete user from database, and questions and comments etc

    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // Delete user questions
    await Question.deleteMany({ author: user?._id });

    // TODO: Delete user answers,comments, etc

    return user;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
};

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("❌🔍 User not found 🔍❌");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      // add question to saved
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const { clerkId, searchQuery, filter, page = 1, pageSize = 10 } = params;

    // for Pagination => caluclate the number of posts to skip based on the pageNumber and pageSize
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery as string, "i") } }
      : {};
    console.log(" Tfilter -->", filter);
    /**
     * Filter
     */
    let sortOption = {};
    switch (filter) {
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "frequent":
        sortOption = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      case "most_recent":
        sortOption = { createdAt: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "most_voted":
        sortOption = { upVotes: -1 };
        break;
      case "most_viewed":
        sortOption = { views: -1 };
        break;
      case "most_answered":
        sortOption = { answers: -1 };
        break;

      default:
        break;
    }
    console.log(" @@@ sortOption", sortOption);
    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOption,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    /**
     * Pagination
     */
    const isNext = user.saved.length > pageSize;

    if (!user) {
      throw new Error("❌🔍 User not found 🔍❌");
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}
