import { useState, useEffect } from 'react';
import { FullScreenLoader } from './components/ui/FullScreenLoader';
import { ProductsTable } from './components/products/ProductsTable';
import { Header } from './components/layout/Header';
import { useProducts } from './hooks/useProducts';
import "./App.css"

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { data, isLoading: productsLoading, error } = useProducts();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);



  if (productsLoading || !data?.products) {
    return <FullScreenLoader isLoading={true} />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <FullScreenLoader isLoading={isLoading} />
      <Header />
      <main className="container mx-auto p-4">
        <ProductsTable 
          products={data.products}
        />
      </main>
    </div>
  );
}

export default App