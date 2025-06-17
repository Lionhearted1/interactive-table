import { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductsResponse } from '@/types/product';

export function useProducts() {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null); // Clear any previous errors
        
        const response = await axios.get<ProductsResponse>(
          'https://dummyjson.com/products?limit=194',
          {
            timeout: 10000, // 10 second timeout
          }
        );
        
        setData(response.data);
      } catch (err) {
        let errorMessage = 'An error occurred while loading products';
        
        if (axios.isAxiosError(err)) {
          if (err.code === 'ECONNABORTED') {
            errorMessage = 'Request timeout - please check your connection';
          } else if (err.code === 'ERR_NETWORK') {
            errorMessage = 'Network error - please check your internet connection';
          } else if (err.response) {
            errorMessage = `Server error: ${err.response.status}`;
          } else if (err.request) {
            errorMessage = 'No response from server - please check your connection';
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { data, isLoading, error };
}