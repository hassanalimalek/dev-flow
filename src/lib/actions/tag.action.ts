"use server";

import User from "@/database/user.modal";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.modal";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.modal";
import { Filter } from "lucide-react";
import { Console } from "console";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();

    const { userId } = params;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    return [
      { name: "Tag 1", id: 1 },
      { name: "Tag 2", id: 2 },
      { name: "Tag 3", id: 3 },
    ];
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}
export async function getPopularTags() {
  try {
    connectToDatabase();
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberofQuestions: { $size: "$questions" } } },
      { $sort: { numberofQuestions: -1 } },
      { $limit: 5 },
    ]);
    return popularTags;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 10, filter, searchQuery } = params;

    // Calculate the number of posts to skip based on the page

    const skipAmount = (Number(page) - 1) * Number(pageSize);
    const query: FilterQuery<typeof Tag> = {};
    let sortOptions = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery as string, "i") } },
      ];
    }

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "old":
        sortOptions = { createdOn: 1 };
        break;
      case "recent":
        sortOptions = { createdOn: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .limit(pageSize)
      .skip(skipAmount);

    const totalTags = await Tag.countDocuments();

    const isNext = totalTags > skipAmount + tags.length;


    return { tags, isNext };
    return tags;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    // for Pagination => caluclate the number of posts to skip based on the pageNumber and pageSize
    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1, // +1 to check if there is next page
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("❌🔍 Tag not found 🔍❌");
    }

    const isNext = tag.questions.length > pageSize;

    const questions = tag.questions;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}
