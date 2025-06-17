// src/components/products/FilterControls.tsx

import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { FilterState, FilterOption } from '@/types/search';
import { RangeSlider } from './RangeSlider';

interface FilterControlsProps {
  filterState: FilterState;
  onTogglePanel: () => void;
  onAddFilter: (groupId: string, option: FilterOption) => void;
  onAddRangeFilter: (groupId: string, range: [number, number]) => void;
  onRemoveFilter: (filterId: string) => void;
  onClearAllFilters: () => void;
  getRangeValues: (groupId: string) => [number, number];
  className?: string;
}

export function FilterControls({
  filterState,
  onTogglePanel,
  onAddFilter,
  onAddRangeFilter,
  onRemoveFilter,
  onClearAllFilters,
  getRangeValues,
  className = "",
}: FilterControlsProps) {
  const [expandedGroups, setExpandedGroups] = useState(new Set<string>(['category', 'brand']));

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const isFilterActive = (groupId: string, optionValue: string) => {
    return filterState.activeFilters.some(
      filter => filter.groupId === groupId && filter.value === optionValue
    );
  };

  const handleCheckboxChange = (groupId: string, option: FilterOption, checked: boolean) => {
    if (checked) {
      onAddFilter(groupId, option);
    } else {
      const activeFilter = filterState.activeFilters.find(
        filter => filter.groupId === groupId && filter.value === option.value
      );
      if (activeFilter) {
        onRemoveFilter(activeFilter.id);
      }
    }
  };

  const hasActiveFilters = filterState.activeFilters.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onTogglePanel}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
            {filterState.activeFilters.length}
          </Badge>
        )}
        </Button>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filterState.activeFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span className="text-xs">
                {filter.groupLabel}: {typeof filter.value === 'object' 
                  ? `${filter.value[0]} - ${filter.value[1]}`
                  : filter.label
                }
              </span>
              <button
                onClick={() => onRemoveFilter(filter.id)}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Panel */}
      {filterState.isOpen && (
        <Card className="p-4 space-y-4">
          {filterState.filterGroups.map((group) => (
            <div key={group.id} className="space-y-2">
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-between w-full text-left text-sm font-medium hover:text-primary transition-colors"
              >
                {group.label}
                {expandedGroups.has(group.id) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expandedGroups.has(group.id) && (
                <div className="pl-2 space-y-2">
                  {group.type === 'checkbox' && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {group.options.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isFilterActive(group.id, option.value)}
                            onChange={(e) => handleCheckboxChange(group.id, option, e.target.checked)}
                            className="rounded border-border"
                          />
                          <span className="text-sm flex-1">{option.label}</span>
                          <span className="text-xs text-muted-foreground">
                            ({option.count})
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {group.type === 'range' && (
                    <div className="py-2">
                      <RangeSlider
                        min={getRangeValues(group.id)[0]}
                        max={getRangeValues(group.id)[1]}
                        value={
                          filterState.activeFilters.find(f => f.groupId === group.id)?.value as [number, number] ||
                          getRangeValues(group.id)
                        }
                        onChange={(range) => onAddRangeFilter(group.id, range)}
                        step={group.id === 'price' ? 0.01 : 1}
                        label={group.label}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}