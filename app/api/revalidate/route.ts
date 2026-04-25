import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

type RevalidateRequestBody = {
  secret?: string;
  tags?: string[];
  paths?: string[];
};

const REVALIDATE_SECRET =
  process.env.REVALIDATE_SECRET ?? "khaiy-code-local-revalidate";

export async function POST(request: Request) {
  let body: RevalidateRequestBody;

  try {
    body = (await request.json()) as RevalidateRequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body" },
      { status: 400 },
    );
  }

  if (body.secret !== REVALIDATE_SECRET) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized revalidation request" },
      { status: 401 },
    );
  }

  const tags = body.tags?.filter(Boolean) ?? [];
  const paths = body.paths?.filter(Boolean) ?? [];

  if (tags.length === 0 && paths.length === 0) {
    return NextResponse.json(
      { ok: false, message: "No tags or paths provided" },
      { status: 400 },
    );
  }

  tags.forEach((tag) => revalidateTag(tag, "max"));
  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({
    ok: true,
    paths,
    revalidated: true,
    tags,
  });
}
