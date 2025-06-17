// src/hooks/useFilters.ts

import { useState, useMemo } from 'react';
import { Product } from '@/types/product';
import { FilterState, FilterGroup, FilterOption, ActiveFilter, PriceRange, RatingRange, StockRange } from '@/types/search';

export function useFilters(products: Product[]) {
  const [filterState, setFilterState] = useState<FilterState>({
    activeFilters: [],
    filterGroups: [],
    isOpen: false,
  });

  // Generate filter groups based on products
  const filterGroups = useMemo((): FilterGroup[] => {
    const categoryCount = new Map<string, number>();
    const brandCount = new Map<string, number>();
    const availabilityCount = new Map<string, number>();
    
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let minRating = Infinity;
    let maxRating = -Infinity;
    let minStock = Infinity;
    let maxStock = -Infinity;

    products.forEach(product => {
      // Categories
      const category = product.category;
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);

      // Brands
      const brand = product.brand;
      brandCount.set(brand, (brandCount.get(brand) || 0) + 1);

      // Availability
      const availability = product.availabilityStatus;
      availabilityCount.set(availability, (availabilityCount.get(availability) || 0) + 1);

      // Price range
      minPrice = Math.min(minPrice, product.price);
      maxPrice = Math.max(maxPrice, product.price);

      // Rating range
      minRating = Math.min(minRating, product.rating);
      maxRating = Math.max(maxRating, product.rating);

      // Stock range
      minStock = Math.min(minStock, product.stock);
      maxStock = Math.max(maxStock, product.stock);
    });

    const groups: FilterGroup[] = [];

    // Category filter
    if (categoryCount.size > 1) {
      groups.push({
        id: 'category',
        label: 'Category',
        type: 'checkbox',
        options: Array.from(categoryCount.entries())
          .sort(([, a], [, b]) => b - a)
          .map(([category, count]) => ({
            id: `category-${category}`,
            label: category.charAt(0).toUpperCase() + category.slice(1),
            value: category,
            count,
          })),
      });
    }

    // Brand filter
    if (brandCount.size > 1) {
      groups.push({
        id: 'brand',
        label: 'Brand',
        type: 'checkbox',
        options: Array.from(brandCount.entries())
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10) // Limit to top 10 brands
          .map(([brand, count]) => ({
            id: `brand-${brand}`,
            label: brand,
            value: brand,
            count,
          })),
      });
    }

    // Price range filter
    if (isFinite(minPrice) && isFinite(maxPrice) && minPrice < maxPrice) {
      groups.push({
        id: 'price',
        label: 'Price Range',
        type: 'range',
        options: [
          {
            id: 'price-range',
            label: `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`,
            value: `${minPrice}-${maxPrice}`,
            count: products.length,
          },
        ],
      });
    }

    // Rating filter
    if (isFinite(minRating) && isFinite(maxRating) && minRating < maxRating) {
      groups.push({
        id: 'rating',
        label: 'Rating',
        type: 'range',
        options: [
          {
            id: 'rating-range',
            label: `${minRating.toFixed(1)} - ${maxRating.toFixed(1)}`,
            value: `${minRating}-${maxRating}`,
            count: products.length,
          },
        ],
      });
    }

    // Stock filter
    if (isFinite(minStock) && isFinite(maxStock) && minStock < maxStock) {
      groups.push({
        id: 'stock',
        label: 'Stock Level',
        type: 'range',
        options: [
          {
            id: 'stock-range',
            label: `${minStock} - ${maxStock} units`,
            value: `${minStock}-${maxStock}`,
            count: products.length,
          },
        ],
      });
    }

    // Availability filter
    if (availabilityCount.size > 1) {
      groups.push({
        id: 'availability',
        label: 'Availability',
        type: 'checkbox',
        options: Array.from(availabilityCount.entries())
          .sort(([, a], [, b]) => b - a)
          .map(([availability, count]) => ({
            id: `availability-${availability}`,
            label: availability,
            value: availability,
            count,
          })),
      });
    }

    return groups;
  }, [products]);

  // Update filter groups when they change
  useMemo(() => {
    setFilterState(prev => ({
      ...prev,
      filterGroups,
    }));
  }, [filterGroups]);

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    if (filterState.activeFilters.length === 0) return products;

    return products.filter(product => {
      return filterState.activeFilters.every(filter => {
        switch (filter.groupId) {
          case 'category':
            return product.category === filter.value;
          
          case 'brand':
            return product.brand === filter.value;
          
          case 'availability':
            return product.availabilityStatus === filter.value;
          
          case 'price':
            if (Array.isArray(filter.value)) {
              const [min, max] = filter.value as PriceRange;
              return product.price >= min && product.price <= max;
            }
            return true;
          
          case 'rating':
            if (Array.isArray(filter.value)) {
              const [min, max] = filter.value as RatingRange;
              return product.rating >= min && product.rating <= max;
            }
            return true;
          
          case 'stock':
            if (Array.isArray(filter.value)) {
              const [min, max] = filter.value as StockRange;
              return product.stock >= min && product.stock <= max;
            }
            return true;
          
          default:
            return true;
        }
      });
    });
  }, [products, filterState.activeFilters]);

  const addFilter = (groupId: string, option: FilterOption) => {
    const filter: ActiveFilter = {
      id: option.id,
      groupId,
      groupLabel: filterGroups.find(g => g.id === groupId)?.label || groupId,
      label: option.label,
      value: option.value,
    };

    setFilterState(prev => ({
      ...prev,
      activeFilters: [...prev.activeFilters.filter(f => f.id !== option.id), filter],
    }));
  };

  const addRangeFilter = (groupId: string, range: [number, number]) => {
    const group = filterGroups.find(g => g.id === groupId);
    if (!group) return;

    const filter: ActiveFilter = {
      id: `${groupId}-range`,
      groupId,
      groupLabel: group.label,
      label: `${range[0]} - ${range[1]}`,
      value: range,
    };

    setFilterState(prev => ({
      ...prev,
      activeFilters: [...prev.activeFilters.filter(f => f.groupId !== groupId), filter],
    }));
  };

  const removeFilter = (filterId: string) => {
    setFilterState(prev => ({
      ...prev,
      activeFilters: prev.activeFilters.filter(f => f.id !== filterId),
    }));
  };

  const clearAllFilters = () => {
    setFilterState(prev => ({
      ...prev,
      activeFilters: [],
    }));
  };

  const toggleFilterPanel = () => {
    setFilterState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  };

  const closeFilterPanel = () => {
    setFilterState(prev => ({
      ...prev,
      isOpen: false,
    }));
  };

  // Get available values for range filters
  const getRangeValues = (groupId: string): [number, number] => {
    const prices = products.map(p => p.price);
    const ratings = products.map(p => p.rating);
    const stocks = products.map(p => p.stock);

    switch (groupId) {
      case 'price':
        return [Math.min(...prices), Math.max(...prices)];
      case 'rating':
        return [Math.min(...ratings), Math.max(...ratings)];
      case 'stock':
        return [Math.min(...stocks), Math.max(...stocks)];
      default:
        return [0, 100];
    }
  };

  const handleFilterChange = (filterId: string, value: [number, number] | string) => {
    let newValue: string | [number, number];

    switch (filterId) {
      case 'price':
      case 'rating':
      case 'stock':
        newValue = value as [number, number];
        break;
      case 'category':
      case 'brand':
        newValue = value as string;
        break;
      default:
        return;
    }

    setFilterState(prev => ({
      ...prev,
      activeFilters: prev.activeFilters.map(filter => 
        filter.groupId === filterId 
          ? { ...filter, value: newValue }
          : filter
      ),
    }));
  };

  return {
    filterState,
    filteredProducts,
    addFilter,
    addRangeFilter,
    removeFilter,
    clearAllFilters,
    toggleFilterPanel,
    closeFilterPanel,
    getRangeValues,
    handleFilterChange,
  };
}