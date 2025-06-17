import { SortField } from "./sortConfig";
import { Product } from "./product";

export interface ColumnConfig {
  field: SortField;
  label: string;
  className?: string;
}

export interface TableCellProps {
  product: Product;
  field: SortField;
  column: ColumnConfig;
  sortInfo: {
    active: boolean;
    order: "asc" | "desc" | null;
    priority: number | null;
  };
}

export interface TableHeaderProps {
  column: ColumnConfig;
  onSort: (field: SortField) => void;
  sortInfo: {
    active: boolean;
    order: "asc" | "desc" | null;
    priority: number | null;
  };
  multiSortMode: boolean;
} 