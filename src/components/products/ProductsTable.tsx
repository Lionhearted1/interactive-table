import { useState } from "react";
import { useSort } from "@/hooks/useSort";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { ProductDetails } from "./ProductDetails";
import { Product } from "@/types/product";
import { SortConfig } from "@/types/sortConfig";

interface ProductsTableProps {
  products: Product[];
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30];

export function ProductsTable({ products }: ProductsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { sortConfigs, handleSort, sortData } = useSort<Product>();

  const sortedProducts = sortData(products);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const renderSortIcon = (field: string) => {
    const config = sortConfigs.find((c: SortConfig) => c.field === field);
    if (!config) return <ArrowUpDown className="h-4 w-4 text-muted-foreground/50" />;
    
    // Show the sort order and priority
    const priority = sortConfigs.findIndex((c) => c.field === field) + 1;
    return (
      <div className="flex items-center gap-1">
        {config.order === "asc" ? (
          <ArrowUp className="h-4 w-4 text-accent-foreground" />
        ) : (
          <ArrowDown className="h-4 w-4 text-accent-foreground" />
        )}
        {sortConfigs.length > 1 && (
          <span className="text-xs text-muted-foreground">{priority}</span>
        )}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Items per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="transition-all duration-300">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="image-col">Image</TableHead>
              <TableHead className="title-col">
                <div className="flex items-center justify-between gap-2">
                  Title
                  <button
                    onClick={() => handleSort("title")}
                    className="hover:text-accent-foreground flex items-center gap-1"
                  >
                    {renderSortIcon("title")}
                  </button>
                </div>
              </TableHead>
              <TableHead className="price-col">
                <div className="flex items-center justify-between gap-2">
                  Price
                  <button
                    onClick={() => handleSort("price")}
                    className="hover:text-accent-foreground flex items-center gap-1"
                  >
                    {renderSortIcon("price")}
                  </button>
                </div>
              </TableHead>
              <TableHead className="stock-col">
                <div className="flex items-center justify-between gap-2">
                  Stock
                  <button
                    onClick={() => handleSort("stock")}
                    className="hover:text-accent-foreground flex items-center gap-1"
                  >
                    {renderSortIcon("stock")}
                  </button>
                </div>
              </TableHead>
              <TableHead className="rating-col">
                <div className="flex items-center justify-between gap-2">
                  Rating
                  <button
                    onClick={() => handleSort("rating")}
                    className="hover:text-accent-foreground flex items-center gap-1"
                  >
                    {renderSortIcon("rating")}
                  </button>
                </div>
              </TableHead>
              <TableHead className="category-col">Category</TableHead>
              <TableHead className="actions-col">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((product) => (
              <TableRow key={product.id}>
                <TableCell className={`image-col ${sortConfigs.some((c: SortConfig) => c.field === "image") ? "sorted-col" : ""}`}>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className={`title-col ${sortConfigs.some((c: SortConfig) => c.field === "title") ? "sorted-col" : ""}`}>
                  <div className="truncate" title={product.title}>{product.title}</div>
                </TableCell>
                <TableCell className={`price-col ${sortConfigs.some((c: SortConfig) => c.field === "price") ? "sorted-col" : ""}`}>
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell className={`stock-col ${sortConfigs.some((c: SortConfig) => c.field === "stock") ? "sorted-col" : ""}`}>
                  {product.stock}
                </TableCell>
                <TableCell className={`rating-col ${sortConfigs.some((c: SortConfig) => c.field === "rating") ? "sorted-col" : ""}`}>
                  {product.rating.toFixed(1)}
                </TableCell>
                <TableCell className={`category-col ${sortConfigs.some((c: SortConfig) => c.field === "category") ? "sorted-col" : ""}`}>
                  <div className="truncate" title={product.category}>{product.category}</div>
                </TableCell>
                <TableCell className="actions-col">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of {products.length} items
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        />
      )}
    </Card>
  );
}
