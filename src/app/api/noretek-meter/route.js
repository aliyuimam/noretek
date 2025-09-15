// src/app/api/noretek-meter/route.js
import { NextResponse } from "next/server";

// 🔐 Hardcode your Noretek credentials here
const loginData = {
  userId: "0001",
  password: "Ntk0001@#",
  company: "Noretek Energy",
};

// Function to login and get a fresh token
async function getFreshToken() {
  const res = await fetch("http://47.107.69.132:9400/API/User/Login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  });

  if (!res.ok) {
    throw new Error("Failed to login to Noretek API");
  }

  const data = await res.json();
  return data?.result?.token || null;
}

export async function POST(request) {
  try {
    let { token } = await request.json();

    // If no token, login first
    if (!token) {
      token = await getFreshToken();
      if (!token) {
        return NextResponse.json(
          { success: false, message: "Unable to fetch token" },
          { status: 401 }
        );
      }
    }

    // Try fetching meters with the token
    let res = await fetch("http://47.107.69.132:9400/API/Meter/Read", {
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

    // If token expired/unauthorized, refresh and retry once
    if (res.status === 401) {
      token = await getFreshToken();
      res = await fetch("http://47.107.69.132:9400/API/Meter/Read", {
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
    }

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch meters" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      meters: data?.result?.data || [],
      token, // 👈 return token so frontend can store it
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
