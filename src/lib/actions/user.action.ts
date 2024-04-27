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
} from "./shared.types";
import { FilterQuery } from "mongoose";
import Tag from "@/database/tag.modal";
import Answer from "@/database/answer.modal";

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
    const totalAnswers = await Answer.countDocuments({ author: user?._id });

    return { user, totalQuestions, totalAnswers };
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
};

export const getAllUsers = async (params: any = {}) => {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();
    console.log("params -->", params);
    const { page = 1, pageSize = 10, filter, searchQuery } = params;
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize);
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

export const updateUser = async (params: any) => {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    const user = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath(path);
    return user;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
};

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

    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

    // for Pagination => caluclate the number of posts to skip based on the pageNumber and pageSize
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    /**
     * Filter
     */
    let sortOption = {};
    switch (filter) {
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
