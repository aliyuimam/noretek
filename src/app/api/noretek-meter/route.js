// src/app/api/noretek-meter/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token required" },
        { status: 400 }
      );
    }

    const res = await fetch("http://47.107.69.132:9400/API/Meter/Read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        createDateRange: [],
        updateDateRange: [],
        pageNumber: 1,
        pageSize: 100,
        company: "Noretek Energy",
        searchTerm: "",
        sortField: "meterId",
        sortOrder: "asc",
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch meters" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, meters: data?.result?.data || [] });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
