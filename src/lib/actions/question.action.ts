"use server";

import Question from "@/database/question.modal";
import Answer from "@/database/answer.modal";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.modal";
import User from "@/database/user.modal";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  QuestionVoteParams,
  RecommendedParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.modal";
import { FilterQuery } from "mongoose";
import { toast } from "@/components/ui/use-toast";

export async function createQuestion(params: CreateQuestionParams) {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;
    // Create the question

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

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

    // Create an interaction record for user's ask-question action and then increment author's reputation by +5 for creating a question

    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (e: any) {
    toast({
      title: e?.message || "Error generating result",
    });
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.content = content;

    await question.save();

    revalidatePath(path);
  } catch (e: any) {
    toast({
      title: e?.message || "Error generating result",
    });
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (e: any) {
    toast({
      title: e?.message || "Error generating result",
    });
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
  } catch (e: any) {
    toast({
      title: e?.message || "Error generating result",
    });
  }
}

export async function getQuestions(params: any) {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();
    const { searchKey, filter, page = 1, pageSize = 10 } = params;

    // Calculate the number of posts to skip based on the page
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Question> = {};
    if (searchKey) {
      query.$or = [
        { title: { $regex: searchKey, $options: "i" } },
        { content: { $regex: searchKey, $options: "i" } },
      ];
    }
    let sortOptions = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }
    const questions = await Question.find(query)
      .populate("tags", { modal: Tag })
      .populate("author", { modal: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);
    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skipAmount + questions.length;
    return { questions, isNext };
  } catch (e: any) {
    toast({
      title: e?.message || "Error generating result",
    });
  }
}
export async function getTopQuestions() {
  try {
    connectToDatabase();
    return await Question.find()
      .populate("tags", { modal: Tag })
      .populate("author", { modal: User })
      .sort({ views: -1 })
      .limit(5);
  } catch (e: any) {
    toast({
      title: e?.message || "Error generating result",
    });
  }
}

export async function getUserQuestions(params: any) {
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
  } catch (e: any) {
    toast({
      title: e?.message || "Error generating result",
    });
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
  } catch (e: any) {
    toast({
      title: e?.message || "Error generating result",
    });
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
  } catch (e: any) {
    toast({
      title: e?.message || "Error generating result",
    });
  }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 20, searchQuery } = params;

    // find user
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("user not found");
    }

    const skipAmount = (page - 1) * pageSize;

    // Find the user's interactions
    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();

    // Extract tags from user's interactions
    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    // Get distinct tag IDs from user's interactions
    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
        { author: { $ne: user._id } }, // Exclude user's own questions
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (e: any) {
    toast({
      title: e?.message || "Error generating result",
    });
  }
}