// src/app/api/noretek-login/route.js
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await fetch("http://47.107.69.132:9400/API/User/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "0001",
        password: "Ntk0001@#",
        company: "Noretek Energy",
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Login failed", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, token: data?.result?.token || "" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
