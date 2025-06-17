import { TableHead } from "@/components/ui/table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { TableHeaderProps } from "@/types/table";

export function TableHeader({ column, onSort, sortInfo, multiSortMode }: TableHeaderProps) {
  return (
    <TableHead className={column.className}>
      <div className="flex items-center justify-between gap-2">
        <span>{column.label}</span>
        <button
          onClick={() => onSort(column.field)}
          className="hover:text-accent-foreground flex items-center gap-1 transition-colors p-1 rounded"
          title={`Sort by ${column.field}${multiSortMode ? ' (Multi-sort mode)' : ''}`}
        >
          <div className="flex items-center gap-1">
            {!sortInfo.active ? (
              <ArrowUpDown className="h-4 w-4 text-muted-foreground/50" />
            ) : (
              <>
                {sortInfo.order === "asc" ? (
                  <ArrowUp className="h-4 w-4 text-accent-foreground" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-accent-foreground" />
                )}
                {multiSortMode && sortInfo.priority && (
                  <span className="text-xs text-accent-foreground bg-accent rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {sortInfo.priority}
                  </span>
                )}
              </>
            )}
          </div>
        </button>
      </div>
    </TableHead>
  );
} 