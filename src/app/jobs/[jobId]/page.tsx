"use server";

import Link from "next/link";

interface Payload {
  data: Record<string, string>[];
  page: number;
  page_size: number;
  total_rows: number;
}

export default async function JobPage({
  params,
  searchParams,
}: {
  params: { jobId: string };
  searchParams: { page?: number };
}) {
  const page = searchParams.page ?? 1;

  const res = await fetch(
    `${process.env.URL}/visualize/${params.jobId}?page=${page}`,
  );
  const payload: Payload = await res.json();
  const columns =
    payload.data.length > 0 ? Object.keys(payload.data[0] ?? {}) : [];
  const numPages = Math.ceil(payload.total_rows / payload.page_size);

  return (
    <div className="flex h-3/4 w-3/4 flex-col items-center justify-center gap-y-6 p-10">
      <p>JobId: {params.jobId}</p>

      <div
        className="grid w-1/2 gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((col) => (
          <div className="col-span-1 text-xl font-bold">{col}</div>
        ))}
        {payload.data.map((d) =>
          Object.entries(d).map((entry) => (
            <div key={`${entry[0]}**${entry[1]}`} className="flex">
              <span className="col-span-1">{entry[1]}</span>
            </div>
          )),
        )}
      </div>

      <div className="mb-2 mt-auto flex items-center gap-x-8">
        <Link
          href={`/jobs/${params.jobId}?page=${Math.max(1, Number(page) - 1)}`}
        >
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-lg transition-all hover:brightness-125 disabled:pointer-events-none disabled:opacity-50"
            disabled={page === 1}
          >
            Prev
          </button>
        </Link>
        <p>
          Page {page} of {numPages}
        </p>
        <Link
          href={`/jobs/${params.jobId}?page=${Math.min(Number(page) + 1, numPages)}`}
        >
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-lg transition-all hover:brightness-125 disabled:pointer-events-none disabled:opacity-50"
            disabled={page === numPages}
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
}
