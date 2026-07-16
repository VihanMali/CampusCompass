export async function GET() {
  //this will only work if the website and the chatBackend.py file is running on the same device with 
  //chatBackend.py running on port 5000
  const res = await fetch("http://127.0.0.1:5000/api/chat");
  const data = await res.json();
  return Response.json(data, { status: res.status });
}

export async function POST(request) {
  const body = await request.json();
  const res = await fetch("http://127.0.0.1:5000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
// import { NextResponse } from "next/server";

// const chats = [];

// export async function GET() {
//   return NextResponse.json(chats);
// }

// export async function POST(request) {
//   const body = await request.json();

//   chats.push({
//     id: Date.now(),
//     username: body.username,
//     user: body.username,
//     msg: body.msg,
//   });

//   return NextResponse.json({ success: true });
// }
