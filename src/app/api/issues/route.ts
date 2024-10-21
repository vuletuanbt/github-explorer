import { createIssue, issueCursorPagination } from "@/features/issue/services";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  const owner = request.nextUrl.searchParams.get("owner") as string;
  const name = request.nextUrl.searchParams.get("name") as string;
  const after = request.nextUrl.searchParams.get("after");
  const { result } = await issueCursorPagination({ owner, name, after });
  try {
    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.log("🔴 Error", error);
    //@ts-expect-error
    return NextResponse.json({ error: error.message });
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const repositoryId = formData.get("repositoryId") as string;
  const title = formData.get("title")?.toString() as string;
  const body = formData.get("body")?.toString() as string;
  const { result } = await createIssue({ repositoryId, title, body });
  try {
    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.log("🔴 Error", error);
    //@ts-ignore
    return NextResponse.json({ error: error.message });
  }
}
