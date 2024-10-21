import { repositoryCursorPagination } from "@/features/repository/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username") as string;
  const after = request.nextUrl.searchParams.get("after");

  try {
    const { result } = await repositoryCursorPagination({ username, after });
    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.log("🔴 Error", error);
    //@ts-expect-error
    return NextResponse.json({ error: error.message });
  }
}
