// src/app/api/noretek-login/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, password, company } = await request.json();

    if (!userId || !password || !company) {
      return NextResponse.json(
        { success: false, message: "Missing credentials" },
        { status: 400 }
      );
    }

    // 🔑 Call the external Noretek login API
    const res = await fetch("http://47.107.69.132:9400/API/User/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password, company }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Login failed" },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (data?.result?.token) {
      return NextResponse.json({
        success: true,
        token: data.result.token,
        expiresIn: data.result.expiresIn || 3600,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid response from login API" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
