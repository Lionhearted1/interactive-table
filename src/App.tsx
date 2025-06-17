// src/App.tsx

import { useState, useEffect } from 'react';
import { FullScreenLoader } from './components/ui/FullScreenLoader';
import { ProductsTable } from './components/products/ProductsTable';
import { ProductsSearch } from './components/products/ProductsSearch';
import { Header } from './components/layout/Header';
import { useProducts } from './hooks/useProducts';
import { Product } from './types/product';
import "./App.css"

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { data, isLoading: productsLoading, error } = useProducts();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  // Initialize filtered products when data loads
  useEffect(() => {
    if (data?.products) {
      setFilteredProducts(data.products);
    }
  }, [data?.products]);

  const handleProductsChange = (products: Product[]) => {
    setFilteredProducts(products);
  };

  if (productsLoading || !data?.products) {
    return <FullScreenLoader isLoading={true} />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-destructive">Error Loading Products</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FullScreenLoader isLoading={isLoading} />
      <Header />
      <main className="container mx-auto p-4 space-y-6">
        {/* Search and Filter Section */}
        <ProductsSearch
          products={data.products}
          onProductsChange={handleProductsChange}
        />
        
        {/* Products Table */}
        <ProductsTable
          products={filteredProducts}
        />
      </main>
    </div>
  );
}

export default App