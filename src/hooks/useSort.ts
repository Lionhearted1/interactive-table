import { useState, useCallback } from "react";
import { SortConfig, SortField } from "@/types/sortConfig";

type SortableValue = number | string;

export function useSort<T>() {
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);
  const [multiSortMode, setMultiSortMode] = useState(false);

  const handleSort = useCallback((field: SortField) => {
    setSortConfigs(prevConfigs => {
      // If not in multi-sort mode, replace all configs
      if (!multiSortMode) {
        const existingConfig = prevConfigs.find(config => config.field === field);
        if (existingConfig) {
          // Toggle order if field is already sorted
          return [{
            field,
            order: existingConfig.order === "asc" ? "desc" : "asc"
          }];
        }
        // Add new sort config
        return [{
          field,
          order: "asc"
        }];
      }

      // Multi-sort mode logic
      const existingConfig = prevConfigs.find(config => config.field === field);
      if (existingConfig) {
        // Toggle order if field is already sorted
        return prevConfigs.map(config => 
          config.field === field
            ? { ...config, order: config.order === "asc" ? "desc" : "asc" }
            : config
        );
      }
      // Add new sort config with next priority
      return [...prevConfigs, {
        field,
        order: "asc"
      }];
    });
  }, [multiSortMode]);

  const toggleMultiSortMode = useCallback(() => {
    setMultiSortMode(prev => !prev);
  }, []);

  const clearSort = useCallback(() => {
    setSortConfigs([]);
  }, []);

  const removeSort = useCallback((field: SortField) => {
    setSortConfigs(prevConfigs => 
      prevConfigs.filter(config => config.field !== field)
    );
  }, []);

  const moveSortPriority = useCallback((field: SortField, direction: 'up' | 'down') => {
    setSortConfigs(prevConfigs => {
      const index = prevConfigs.findIndex(config => config.field === field);
      if (index === -1) return prevConfigs;

      const newConfigs = [...prevConfigs];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex < 0 || newIndex >= newConfigs.length) return prevConfigs;
      
      [newConfigs[index], newConfigs[newIndex]] = [newConfigs[newIndex], newConfigs[index]];
      return newConfigs;
    });
  }, []);

  const getSortInfo = useCallback((field: SortField) => {
    const config = sortConfigs.find(c => c.field === field);
    if (!config) return { active: false, order: null, priority: null };
    
    return {
      active: true,
      order: config.order,
      priority: sortConfigs.findIndex(c => c.field === field) + 1
    };
  }, [sortConfigs]);

  const sortData = useCallback((data: T[]) => {
    if (sortConfigs.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const config of sortConfigs) {
        const aValue = (a as Record<string, SortableValue>)[config.field];
        const bValue = (b as Record<string, SortableValue>)[config.field];
        
        if (aValue === bValue) continue;
        
        const comparison = aValue < bValue ? -1 : 1;
        return config.order === "asc" ? comparison : -comparison;
      }
      return 0;
    });
  }, [sortConfigs]);

  return {
    sortConfigs,
    multiSortMode,
    handleSort,
    toggleMultiSortMode,
    clearSort,
    removeSort,
    moveSortPriority,
    getSortInfo,
    sortData
  };
}