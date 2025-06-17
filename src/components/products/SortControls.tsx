import { Button } from "@/components/ui/button";
import { Layers, RotateCcw, X, ChevronUp, ChevronDown } from "lucide-react";
import { SortConfig } from "@/types/sortConfig";

interface SortControlsProps {
  sortConfigs: SortConfig[];
  multiSortMode: boolean;
  onToggleMultiSort: () => void;
  onClearSort: () => void;
  onRemoveSort: (field: string) => void;
  onMoveSortPriority: (field: string, direction: 'up' | 'down') => void;
}

export function SortControls({
  sortConfigs,
  multiSortMode,
  onToggleMultiSort,
  onClearSort,
  onRemoveSort,
  onMoveSortPriority,
}: SortControlsProps) {
  if (sortConfigs.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {multiSortMode ? "Sorted by:" : "Sort:"}
      </span>
      {sortConfigs.map((config, index) => (
        <div key={config.field} className="flex items-center gap-1">
          <div className="bg-accent text-accent-foreground rounded-lg px-3 py-1 text-sm flex items-center gap-2">
            <span className="font-medium">{config.field}</span>
            <span>{config.order === "asc" ? "↑" : "↓"}</span>
            
            {/* Priority controls for multi-sort */}
            {multiSortMode && sortConfigs.length > 1 && (
              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={() => onMoveSortPriority(config.field, 'up')}
                  disabled={index === 0}
                  className="hover:text-accent-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move up in priority"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onMoveSortPriority(config.field, 'down')}
                  disabled={index === sortConfigs.length - 1}
                  className="hover:text-accent-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move down in priority"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            )}
            
            <button
              onClick={() => onRemoveSort(config.field)}
              className="hover:text-destructive transition-colors"
              title={`Remove ${config.field} sort`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          {index < sortConfigs.length - 1 && (
            <span className="text-muted-foreground/50 text-sm">→</span>
          )}
        </div>
      ))}
    </div>
  );
} 