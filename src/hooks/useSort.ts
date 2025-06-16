import { useState } from "react";
import { cn } from "../lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

export type SortField = "title" | "price" | "stock" | "rating";
export type SortOrder = "asc" | "desc";

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export function useSort(defaultField: SortField = "title") {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: defaultField,
    order: "asc",
  });

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (field: SortField) => {
    const isActive = sortConfig.field === field;
    const isAscending = sortConfig.order === "asc";

    return {
      upArrow: (
        <ArrowUp
          className={cn(
            "ml-2 h-4 w-4",
            isActive && isAscending
              ? "text-primary-foreground"
              : "text-primary-foreground/50"
          )}
        />
      ),
      downArrow: (
        <ArrowDown
          className={cn(
            "ml-2 h-4 w-4",
            isActive && !isAscending
              ? "text-primary-foreground"
              : "text-primary-foreground/50"
          )}
        />
      ),
    };
  };

  const sortData = <T extends Record<string, any>>(data: T[]) => {
    return [...data].sort((a, b) => {
      const multiplier = sortConfig.order === "asc" ? 1 : -1;
      switch (sortConfig.field) {
        case "title":
          return multiplier * a.title.localeCompare(b.title);
        case "price":
          return multiplier * (a.price - b.price);
        case "stock":
          return multiplier * (a.stock - b.stock);
        case "rating":
          return multiplier * (a.rating - b.rating);
        default:
          return 0;
      }
    });
  };

  return {
    sortConfig,
    handleSort,
    getSortIcon,
    sortData,
  };
} 