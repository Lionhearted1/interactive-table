import { useState, useEffect } from 'react';
import { FullScreenLoader } from './components/ui/FullScreenLoader';
import { ProductsTable } from './components/products/ProductsTable';
import { Header } from './components/layout/Header';
import "./App.css"

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <FullScreenLoader isLoading={isLoading} />
      <Header />
      <main className="container mx-auto p-4">
        <ProductsTable />
      </main>
    </div>
  );
}

export default App