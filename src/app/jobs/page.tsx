import Link from "next/link";

interface Job {
  job_id: string;
  status: string;
  metadata: {
    columns: string[];
    types: string[];
    num_rows: number;
  };
}

interface Payload {
  jobs: Job[];
}

export default async function JobsPage() {
  async function getAllJobs() {
    "use server";

    const res = await fetch(`${process.env.URL}/jobs`);
    if (!res.ok) {
      throw new Error("getAllJobs: unable to get jobs");
    }
    return (await res.json()) as Payload;
  }

  const { jobs } = await getAllJobs();

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <ul className="flex w-1/2 flex-col items-center gap-y-2">
        {jobs.map((job) => (
          <Link
            href={`jobs/${job.job_id}`}
            className="w-full cursor-pointer rounded-md bg-gray-200 p-3 transition-all hover:bg-gray-100"
          >
            <p className="text-lg">{job.job_id}</p>
            <p>{job.status}</p>
            <p>Columns: {job.metadata.columns.join(", ")}</p>
          </Link>
        ))}
      </ul>
    </div>
  );
}
