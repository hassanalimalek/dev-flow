import Job from "@/database/job.modal";
import { connectToDatabase } from "../mongoose";
import { Toast } from "@/components/ui/toast";

export async function getJobs(params: any) {
  const { query, filter } = params;

  const findOption: any = {};
  if (filter) {
    if (filter === "all") {
      delete findOption["job_country"];
    } else {
      findOption["job_country"] = new RegExp(filter, "i");
    }
  }
  if (query) {
    findOption["$or"] = [
      { job_title: { $regex: new RegExp(query, "i") } },
      { job_description: { $regex: new RegExp(query, "i") } },
    ];
  }
  try {
    connectToDatabase();
    let jobs = await Job.find(findOption);

    return jobs;
  } catch (e: any) {
    Toast({
      title: e?.message || "Error generating result",
    });
  }
}

export async function getJobCountries() {
  try {
    connectToDatabase();
    let countries = await Job.find().distinct("job_country");

    return countries;
  } catch (e: any) {
    Toast({
      title: e?.message || "Error generating result",
    });
  }
}
