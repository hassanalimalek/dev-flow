"use server";

import Answer from "@/database/answer.modal";
import Question from "@/database/question.modal";
import Tag from "@/database/tag.modal";
import User from "@/database/user.modal";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import { toast } from "@/components/ui/use-toast";

const SearchableTypes = ["question", "answer", "user", "tag"];

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();

    const { query, type } = params;

    const regexQuery = { $regex: query, $options: "i" };

    let results: { title: any; type: string | null | undefined; id: any }[] =
      [];

    const modelsAndTypes = [
      {
        model: Question,
        searchField: "title",
        type: "question",
      },
      {
        model: User,
        searchField: "name",
        type: "user",
      },
      {
        model: Answer,
        searchField: "content",
        type: "answer",
      },
      {
        model: Tag,
        searchField: "name",
        type: "tag",
      },
    ];

    const typeLower = type?.toLowerCase();

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // search everything
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                ? item.question
                : item._id,
          }))
        );
      }
    } else {
      // search specified model for the selected type:- question,answer,user,tag.
      const modelInfo = modelsAndTypes.find((item) => item.type === type);

      if (!modelInfo) {
        throw new Error("Invalid Search Type");
      }

      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery,
        })
        .limit(8);

      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
            ? item.question
            : item._id,
      }));
    }

    return JSON.stringify(results);
  } catch (e: any) {
    toast({
      title: e?.message || "Error generating result",
    });
  }
}
