import { models, model, Document, Schema } from "mongoose";

/**
 * Represents the job interface.
 */
interface IJob extends Document {
  employer_logo: string;
  employer_website: string;
  createdAt: Date;
  job_employment_type: "FULL" | "HALF";
  job_title: string;
  job_description: string;
  job_apply_link: string;
  job_city: string;
  job_state?: string;
  job_country?: string;
  job_salary?: Number;
  country_code?: string;
}

/**
 * Represents the job schema.
 */
const jobSchema = new Schema<IJob>({
  employer_logo: String,
  employer_website: String,
  createdAt: { type: Date, default: Date.now },
  job_employment_type: { type: String, enum: ["FULL", "PART"], required: true },
  job_title: { type: String, required: true },
  job_description: { type: String, required: true },
  job_apply_link: String,
  job_city: { type: String, required: true },
  job_state: String,
  job_country: String,
  job_salary: Number,
  country_code: String,
});

const Job = models?.Job || model<IJob>("Job", jobSchema);

export default Job;
