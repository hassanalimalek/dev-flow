"use server";

import Question from "@/database/question.modal";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.modal";
import { toast } from "@/components/ui/use-toast";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, userId } = params;

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) {
        return;
      }

      // Update view count for the question the user viewing
      await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

      // Create interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (e: any) {
    toast({
      title: e?.message || "Error generating result",
    });
  }
}
