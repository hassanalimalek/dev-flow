import { Schema, models, model, Document } from "mongoose";

/**
 * why extend Document?
 * This means that it's going to get some properties as well,
 * such as the _id, version and everything else that
 * each Document in the MongoDB database has
 *
 */
export interface IInteraction extends Document {
  user: Schema.Types.ObjectId;
  action: string;
  question: Schema.Types.ObjectId;
  answer: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId;
  createdAt: Date;
}

const InteractionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },
  question: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  answer: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  createdAt: { type: Date, default: Date.now },
});

// Check if the model already exists, if not create it
const Interaction =
  models?.Interaction || model("Interaction", InteractionSchema);

export default Interaction;
