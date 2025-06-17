import { useState } from "react";
import { SortField, SortConfig } from "@/types/sortConfig";

export function useSort<T extends Record<string, any>>() {
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);
  const [multiSortMode, setMultiSortMode] = useState(false);

  const handleSort = (field: SortField) => {
    setSortConfigs((prevConfigs) => {
      const existingConfigIndex = prevConfigs.findIndex((config) => config.field === field);
      
      // In single-sort mode, clear other sorts unless it's the same field
      if (!multiSortMode) {
        if (existingConfigIndex === -1) {
          // New field, start with ascending
          return [{ field, order: "asc" }];
        } else {
          const currentConfig = prevConfigs[existingConfigIndex];
          if (currentConfig.order === "asc") {
            // Toggle to descending
            return [{ field, order: "desc" }];
          } else {
            // Remove sort (back to unsorted)
            return [];
          }
        }
      }
      
      // Multi-sort mode
      const newConfigs = [...prevConfigs];
      
      if (existingConfigIndex === -1) {
        // Add new sort with highest priority (at the end of array)
        newConfigs.push({ field, order: "asc" });
      } else {
        const currentConfig = newConfigs[existingConfigIndex];
        if (currentConfig.order === "asc") {
          // Toggle to descending, maintain position
          newConfigs[existingConfigIndex] = { ...currentConfig, order: "desc" };
        } else {
          // Remove this sort config
          newConfigs.splice(existingConfigIndex, 1);
        }
      }
      
      return newConfigs;
    });
  };

  // Toggle between single and multi-sort modes
  const toggleMultiSortMode = () => {
    setMultiSortMode((prev) => {
      // When switching to single-sort mode, keep only the first sort
      if (prev && sortConfigs.length > 1) {
        setSortConfigs((configs) => configs.slice(0, 1));
      }
      return !prev;
    });
  };

  // Clear all sorting
  const clearSort = () => {
    setSortConfigs([]);
  };

  // Remove specific sort
  const removeSort = (field: SortField) => {
    setSortConfigs((prevConfigs) => 
      prevConfigs.filter((config) => config.field !== field)
    );
  };

  // Move sort priority up/down
  const moveSortPriority = (field: SortField, direction: 'up' | 'down') => {
    setSortConfigs((prevConfigs) => {
      const currentIndex = prevConfigs.findIndex((config) => config.field === field);
      if (currentIndex === -1) return prevConfigs;
      
      const newConfigs = [...prevConfigs];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (targetIndex >= 0 && targetIndex < newConfigs.length) {
        // Swap positions
        [newConfigs[currentIndex], newConfigs[targetIndex]] = 
        [newConfigs[targetIndex], newConfigs[currentIndex]];
      }
      
      return newConfigs;
    });
  };

  // Get sort info for a field
  const getSortInfo = (field: SortField) => {
    const configIndex = sortConfigs.findIndex((c) => c.field === field);
    if (configIndex === -1) {
      return { active: false, order: null, priority: null };
    }
    
    return {
      active: true,
      order: sortConfigs[configIndex].order,
      priority: configIndex + 1 // 1-based priority for display
    };
  };

  const sortData = (data: T[]): T[] => {
    if (sortConfigs.length === 0) return data;

    return [...data].sort((a, b) => {
      // Process sort configs in order of priority
      for (const config of sortConfigs) {
        const { field, order } = config;
        const aValue = a[field];
        const bValue = b[field];

        // Handle null/undefined values (push them to the end)
        if (aValue == null && bValue == null) continue;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        // Type-specific comparison
        let comparison = 0;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          // Case-insensitive string comparison
          comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          // Generic comparison for other types
          if (aValue < bValue) comparison = -1;
          else if (aValue > bValue) comparison = 1;
        }

        // Apply sort order
        if (comparison !== 0) {
          return order === "asc" ? comparison : -comparison;
        }
      }
      
      return 0; // Equal values
    });
  };

  return {
    sortConfigs,
    multiSortMode,
    handleSort,
    toggleMultiSortMode,
    clearSort,
    removeSort,
    moveSortPriority,
    getSortInfo,
    sortData,
  };
}