import { models, model, Document, Schema } from "mongoose";

export interface IAnswer extends Document {
  content: string;
  author: Schema.Types.ObjectId;
  createdAt: Date;
  question: Schema.Types.ObjectId;
  upVotes: Schema.Types.ObjectId[];
  downVotes: Schema.Types.ObjectId[];
}

const answerSchema = new Schema<IAnswer>({
  content: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  upVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Answer = models?.Answer || model<IAnswer>("Answer", answerSchema);

export default Answer;
