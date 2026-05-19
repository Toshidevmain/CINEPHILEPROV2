import { Search } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";

export default function SearchInput() {
  return (
    <div className="relative w-full group">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777] group-focus-within:text-netflix transition-colors" />
      <Input
        className="rounded-full pl-9 border-white/10 bg-white/5 text-white placeholder:text-[#555] focus-visible:border-netflix/50 focus-visible:ring-1 focus-visible:ring-netflix/30 transition-all"
        placeholder="Search movies & TV shows"
      />
    </div>
  );
}
