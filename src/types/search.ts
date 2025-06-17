// src/types/search.ts

export interface SearchSuggestion {
    id: string;
    text: string;
    type: 'category' | 'product' | 'brand';
    count?: number;
  }
  
  export interface FilterOption {
    id: string;
    label: string;
    value: string;
    count: number;
  }
  
  export interface FilterGroup {
    id: string;
    label: string;
    type: 'select' | 'range' | 'checkbox';
    options: FilterOption[];
  }
  
  export interface ActiveFilter {
    id: string;
    groupId: string;
    groupLabel: string;
    label: string;
    value: string | number | [number, number];
  }
  
  export interface SearchState {
    query: string;
    suggestions: SearchSuggestion[];
    isLoading: boolean;
    showSuggestions: boolean;
  }
  
  export interface FilterState {
    activeFilters: ActiveFilter[];
    filterGroups: FilterGroup[];
    isOpen: boolean;
  }
  
  export type PriceRange = [number, number];
  export type RatingRange = [number, number];
  export type StockRange = [number, number];