import { useState } from "react";
import { SortField, SortOrder, SortConfig } from "@/types/sortConfig";

export function useSort<T extends Record<string, any>>() {
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);

  const handleSort = (field: SortField) => {
    setSortConfigs((prevConfigs) => {
      const existingConfigIndex = prevConfigs.findIndex((config) => config.field === field);
      const newConfigs = [...prevConfigs];

      if (existingConfigIndex === -1) {
        // Add new sort config at the beginning
        newConfigs.unshift({ field, order: "asc" });
      } else {
        const currentConfig = newConfigs[existingConfigIndex];
        if (currentConfig.order === "asc") {
          // Toggle to desc
          newConfigs[existingConfigIndex] = { ...currentConfig, order: "desc" };
        } else {
          // Remove the sort config
          newConfigs.splice(existingConfigIndex, 1);
        }
      }

      return newConfigs;
    });
  };

  const getSortIcon = (field: SortField) => {
    const config = sortConfigs.find((c) => c.field === field);
    if (!config) return "↕️";
    return config.order === "asc" ? "↑" : "↓";
  };

  const sortData = (data: T[]): T[] => {
    if (sortConfigs.length === 0) return data;

    return [...data].sort((a, b) => {
      // Compare each sort config in order
      for (const config of sortConfigs) {
        const { field, order } = config;
        const aValue = a[field];
        const bValue = b[field];

        // Handle null/undefined values
        if (aValue == null && bValue == null) continue;
        if (aValue == null) return order === "asc" ? -1 : 1;
        if (bValue == null) return order === "asc" ? 1 : -1;

        // Compare values
        if (aValue < bValue) return order === "asc" ? -1 : 1;
        if (aValue > bValue) return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  return {
    sortConfigs,
    handleSort,
    getSortIcon,
    sortData,
  };
} 