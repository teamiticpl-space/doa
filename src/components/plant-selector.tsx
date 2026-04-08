"use client";

import { getPlantTotalRecords, plants } from "@/lib/pest-data";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  selected: string;
  onSelect: (plant: string) => void;
};

export function PlantSelector({ selected, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const list = search
      ? plants.filter((p) => p.toLowerCase().includes(search.toLowerCase()))
      : plants.slice(0, 40);
    return list.map((p) => ({ name: p, records: getPlantTotalRecords(p) }));
  }, [search]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="ค้นหาชนิดพืช..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl glass text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
        />
      </div>
      <div className="max-h-[calc(100vh-240px)] overflow-y-auto space-y-0.5 pr-1">
        {filtered.map((item) => (
          <button
            key={item.name}
            onClick={() => onSelect(item.name)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer group flex items-center justify-between ${
              selected === item.name
                ? "glass-strong text-primary font-medium glow-blue"
                : "hover:bg-muted/60 text-foreground/80 hover:text-foreground"
            }`}
          >
            <span className="truncate">{item.name}</span>
            <span className={`text-[10px] tabular-nums shrink-0 ml-2 ${
              selected === item.name ? "text-primary/70" : "text-muted-foreground/50 group-hover:text-muted-foreground"
            }`}>
              {item.records}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            ไม่พบพืชที่ค้นหา
          </p>
        )}
      </div>
    </div>
  );
}
