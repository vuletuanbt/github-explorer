import { searchUsers } from "@/features/user/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword");
  const result = await searchUsers(keyword as string);
  try {
    return NextResponse.json({ result });
  } catch (error) {
    console.log("🔴 Error", error);
    //@ts-ignore
    return NextResponse.json({ error: error.message });
  }
}
