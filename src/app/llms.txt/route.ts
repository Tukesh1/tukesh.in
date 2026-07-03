import { buildProfileText } from "@/lib/build-profile-text";
import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(buildProfileText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
