// src/components/products/ProductsSearch.tsx

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SearchBar } from './SearchBar';
import { FilterControls } from './FilterControls';
import { useSearch } from '@/hooks/useSearch';
import { useFilters } from '@/hooks/useFilters';
import { Product } from '@/types/product';

interface ProductsSearchProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  className?: string;
}

export function ProductsSearch({
  products,
  onProductsChange,
  className = "",
}: ProductsSearchProps) {
  const {
    searchState,
    filteredProducts: searchFilteredProducts,
    setQuery,
    selectSuggestion,
    clearSearch,
    hideSuggestions,
    showSuggestions,
  } = useSearch(products);

  const {
    filterState,
    filteredProducts: filterFilteredProducts,
    addFilter,
    addRangeFilter,
    removeFilter,
    clearAllFilters,
    toggleFilterPanel,
    getRangeValues,
  } = useFilters(searchFilteredProducts);

  // Combine search and filter results
  const finalFilteredProducts = useMemo(() => {
    return filterFilteredProducts;
  }, [filterFilteredProducts]);

  // Update parent component when filtered products change
  useMemo(() => {
    onProductsChange(finalFilteredProducts);
  }, [finalFilteredProducts, onProductsChange]);

  const hasActiveSearchOrFilters = searchState.query || filterState.activeFilters.length > 0;
  const resultsCount = finalFilteredProducts.length;
  const totalCount = products.length;

  const handleClearAll = () => {
    clearSearch();
    clearAllFilters();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="p-4 space-y-4">
        {/* Search and Filter Controls */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="space-y-2">
            <SearchBar
              searchState={searchState}
              onQueryChange={setQuery}
              onSuggestionSelect={selectSuggestion}
              onClear={clearSearch}
              onFocus={showSuggestions}
              onBlur={hideSuggestions}
            />
          </div>

          {/* Filter Controls */}
          <FilterControls
            filterState={filterState}
            onTogglePanel={toggleFilterPanel}
            onAddFilter={addFilter}
            onAddRangeFilter={addRangeFilter}
            onRemoveFilter={removeFilter}
            onClearAllFilters={clearAllFilters}
            getRangeValues={getRangeValues}
          />
        </div>

        {/* Results Summary */}
        {hasActiveSearchOrFilters && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              {resultsCount === 0 ? (
                "No products found"
              ) : resultsCount === totalCount ? (
                `Showing all ${totalCount} products`
              ) : (
                `Showing ${resultsCount} of ${totalCount} products`
              )}
              {searchState.query && (
                <span> for "<strong>{searchState.query}</strong>"</span>
              )}
            </div>
            
            {hasActiveSearchOrFilters && (
              <button
                onClick={handleClearAll}
                className="text-sm text-primary hover:text-primary/80 underline transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* No Results Message */}
        {hasActiveSearchOrFilters && resultsCount === 0 && (
          <div className="text-center py-8 space-y-2">
            <div className="text-lg font-medium text-muted-foreground">
              No products found
            </div>
            <div className="text-sm text-muted-foreground">
              Try adjusting your search terms or filters
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}