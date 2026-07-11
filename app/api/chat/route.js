import { NextResponse } from "next/server";

const chats = [];

export async function GET() {
  return NextResponse.json(chats);
}

export async function POST(request) {
  const body = await request.json();

  chats.push({
    id: Date.now(),
    username: body.username,
    user: body.username,
    msg: body.msg,
  });

  return NextResponse.json({ success: true });
}