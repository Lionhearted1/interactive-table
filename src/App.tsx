import { useState, useEffect } from 'react';
import { FullScreenLoader } from './components/ui/FullScreenLoader';
import { ProductsTable } from './components/table/ProductsTable';
import { ProductsSearch } from './components/search/ProductsSearch';
import { Header } from './components/layout/Header';
import { useProducts } from './hooks/useProducts';
import { Product } from './types/product';
import "./App.css"

function App() {
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { data, isLoading: productsLoading, error } = useProducts();

  useEffect(() => {
    // Show initial loader for 1.5 seconds
    const timer = setTimeout(() => {
      setShowInitialLoader(false);
    }, 1500);
    
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

  // Show full screen loader during initial load OR when products are loading and we don't have data yet
  const shouldShowFullScreenLoader = showInitialLoader || (productsLoading && !data?.products);

  if (shouldShowFullScreenLoader) {
    return <FullScreenLoader isLoading={true} />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-destructive">Error Loading Products</h2>
          <p className="text-muted-foreground">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 space-y-6">
        {/* Search and Filter Section */}
        <ProductsSearch
          products={data?.products || []}
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

export default App;