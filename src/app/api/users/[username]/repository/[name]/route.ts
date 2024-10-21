import { getRepository } from "@/features/repository/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { username: string; name: string } }
) {
  try {
    const { username, name } = context.params;
    const { result } = await getRepository({ owner: username, name });
    return NextResponse.json({ result });
  } catch (error) {
    console.log("🔴 Error", error);
    //@ts-expect-error
    return NextResponse.json({ error: error.message });
  }
}
