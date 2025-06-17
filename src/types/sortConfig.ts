export type SortField = "image" | "title" | "price" | "stock" | "rating" | "category";
export type SortOrder = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  order: SortOrder;
} 