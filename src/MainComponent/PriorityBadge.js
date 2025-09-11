"use client";
import React from "react";

const PriorityBadge = ({ level }) => {
  let color = "bg-gray-300 text-gray-800";

  if (level === "High") {
    color = "bg-red-500 text-white";
  } else if (level === "Medium") {
    color = "bg-yellow-400 text-black";
  } else if (level === "Low") {
    color = "bg-green-500 text-white";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}
    >
      {level || "N/A"}
    </span>
  );
};

export default PriorityBadge;
