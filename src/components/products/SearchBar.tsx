// src/components/products/SearchBar.tsx

import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchState, SearchSuggestion } from '@/types/search';

interface SearchBarProps {
  searchState: SearchState;
  onQueryChange: (query: string) => void;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  onClear: () => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  searchState,
  onQueryChange,
  onSuggestionSelect,
  onClear,
  onFocus,
  onBlur,
  placeholder = "Search products, categories, or brands...",
  className = "",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const showSuggestions = searchState.showSuggestions && searchState.suggestions.length > 0;

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        suggestionsRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        onBlur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  const handleInputFocus = () => {
    setIsFocused(true);
    onFocus();
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSuggestionSelect(suggestion);
    setTimeout(() => {
        onBlur();
      }, 0);
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'category':
        return '📁';
      case 'brand':
        return '🏷️';
      case 'product':
        return '📦';
      default:
        return '🔍';
    }
  };

  const getSuggestionTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'category':
        return 'Category';
      case 'brand':
        return 'Brand';
      case 'product':
        return 'Product';
      default:
        return '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`relative flex items-center transition-all duration-200 ${
        isFocused ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
      }`}>
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          {searchState.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchState.query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="w-full pl-10 pr-10 py-3 bg-background border border-input rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-input transition-colors"
        />
        
        {searchState.query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          <div className="p-2">
            {searchState.suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-sm opacity-60">
                    {getSuggestionIcon(suggestion.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {suggestion.text}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getSuggestionTypeLabel(suggestion.type)}
                      {suggestion.count && ` • ${suggestion.count} items`}
                    </div>
                  </div>
                </div>
                <Search className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}