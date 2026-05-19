"use client";

import * as React from "react";
import { Moon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-[#B3B3B3] cursor-default" aria-label="Dark mode">
      <Moon className="h-4 w-4" />
    </Button>
  );
}
