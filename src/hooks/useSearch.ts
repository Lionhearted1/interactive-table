// src/hooks/useSearch.ts

import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types/product';
import { SearchState, SearchSuggestion } from '@/types/search';
import { useDebounce } from './useDebounce';

export function useSearch(products: Product[]) {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    suggestions: [],
    isLoading: false,
    showSuggestions: false,
  });

  const debouncedQuery = useDebounce(searchState.query, 300);

  // Generate suggestions based on products
  const allSuggestions = useMemo(() => {
    const suggestions: SearchSuggestion[] = [];
    const categoryCount = new Map<string, number>();
    const brandCount = new Map<string, number>();
    const productTitles = new Set<string>();

    products.forEach(product => {
      // Count categories
      if (product.category) {
        const category = product.category.toLowerCase();
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      }

      // Count brands
      if (product.brand) {
        const brand = product.brand.toLowerCase();
        brandCount.set(brand, (brandCount.get(brand) || 0) + 1);
      }

      // Collect unique product titles
      if (product.title) {
        productTitles.add(product.title);
      }
    });

    // Add category suggestions
    categoryCount.forEach((count, category) => {
      suggestions.push({
        id: `category-${category}`,
        text: category,
        type: 'category',
        count,
      });
    });

    // Add brand suggestions
    brandCount.forEach((count, brand) => {
      suggestions.push({
        id: `brand-${brand}`,
        text: brand,
        type: 'brand',
        count,
      });
    });

    // Add product suggestions (limited to avoid too many suggestions)
    Array.from(productTitles)
      .slice(0, 20)
      .forEach(title => {
        suggestions.push({
          id: `product-${title}`,
          text: title,
          type: 'product',
        });
      });

    return suggestions;
  }, [products]);

  // Filter suggestions based on query
  const filteredSuggestions = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [];

    const query = debouncedQuery.toLowerCase();
    return allSuggestions
      .filter(suggestion => 
        suggestion.text.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        // Prioritize exact matches and categories
        const aExact = a.text.toLowerCase().startsWith(query);
        const bExact = b.text.toLowerCase().startsWith(query);
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then prioritize by type
        const typeOrder = { category: 0, brand: 1, product: 2 };
        const typeDiff = typeOrder[a.type] - typeOrder[b.type];
        if (typeDiff !== 0) return typeDiff;
        
        // Finally by count (for categories and brands)
        if (a.count && b.count) return b.count - a.count;
        
        return a.text.localeCompare(b.text);
      })
      .slice(0, 8); // Limit to 8 suggestions
  }, [debouncedQuery, allSuggestions]);

  // Update suggestions when debounced query changes
  useEffect(() => {
    setSearchState(prev => ({
      ...prev,
      suggestions: filteredSuggestions,
      isLoading: false,
    }));
  }, [filteredSuggestions]);

  // Set loading state when query changes
  useEffect(() => {
    if (searchState.query) {
      setSearchState(prev => ({
        ...prev,
        isLoading: true,
      }));
    }
  }, [searchState.query]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) return products;

    const query = debouncedQuery.toLowerCase();
    return products.filter(product => {
      const title = product.title?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      const category = product.category?.toLowerCase() || '';
      const brand = product.brand?.toLowerCase() || '';
      const tags = product.tags || [];

      return (
        title.includes(query) ||
        description.includes(query) ||
        category.includes(query) ||
        brand.includes(query) ||
        tags.some(tag => tag.toLowerCase().includes(query))
      );
    });
  }, [debouncedQuery, products]);

  const setQuery = (query: string) => {
    setSearchState(prev => ({
      ...prev,
      query,
      showSuggestions: query.length >= 2,
    }));
  };

  const selectSuggestion = (suggestion: SearchSuggestion) => {
    setSearchState(prev => ({
      ...prev,
      query: suggestion.text,
      showSuggestions: true,
    }));
  };

  const clearSearch = () => {
    setSearchState({
      query: '',
      suggestions: [],
      isLoading: false,
      showSuggestions: false,
    });
  };

  const hideSuggestions = () => {
    setSearchState(prev => ({
      ...prev,
      showSuggestions: false,
    }));
  };

  const showSuggestions = () => {
    setSearchState(prev => ({
      ...prev,
      showSuggestions: prev.query.length >= 2,
    }));
  };

  return {
    searchState,
    filteredProducts,
    setQuery,
    selectSuggestion,
    clearSearch,
    hideSuggestions,
    showSuggestions,
  };
}