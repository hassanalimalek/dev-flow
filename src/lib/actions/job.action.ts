import Job from "@/database/job.modal";
import { connectToDatabase } from "../mongoose";
import { toast } from "@/components/ui/use-toast";

export async function getJobs(params: any) {
  const { searchKey, filter, page = 1, pageSize = 10 } = params;

  // Calculate the number of posts to skip based on the page
  const skipAmount = (page - 1) * pageSize;

  const findOption: any = {};
  if (filter) {
    if (filter === "all") {
      delete findOption["job_country"];
    } else {
      findOption["job_country"] = new RegExp(filter, "i");
    }
  }
  if (searchKey) {
    findOption["$or"] = [
      { job_title: { $regex: new RegExp(searchKey, "i") } },
      { job_description: { $regex: new RegExp(searchKey, "i") } },
    ];
  }
  try {
    connectToDatabase();
    let jobs = await Job.find(findOption).skip(skipAmount).limit(pageSize);
    let jobsCount = await Job.countDocuments(findOption);
    let isNext = jobsCount > skipAmount + jobs.length;
    return { jobs, isNext };
  } catch (e: any) {
    toast({
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
    toast({
      title: e?.message || "Error generating result",
    });
  }
}
