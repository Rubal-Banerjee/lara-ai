"use client";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hook";
import React from "react";

const HighlightBar = () => {
  const authStep = useAppSelector((store) => store.authReducer);

  return (
    <div className="grid grid-cols-3 gap-3">
      <div
        className={cn(
          "rounded-full h-2 col-span-1",
          authStep === 1 ? "bg-orange" : "bg-platinum"
        )}
      />
      <div
        className={cn(
          "rounded-full h-2 col-span-1",
          authStep === 2 ? "bg-orange" : "bg-platinum"
        )}
      />
      <div
        className={cn(
          "rounded-full h-2 col-span-1",
          authStep === 3 ? "bg-orange" : "bg-platinum"
        )}
      />
    </div>
  );
};

export default HighlightBar;
