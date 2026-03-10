import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin not configured." }, { status: 503 });
    }

    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}
