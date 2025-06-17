import { useState, useEffect } from "react";
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
  RotateCcw,
  Layers,

} from "lucide-react";
import { ProductDetails } from "./ProductDetails";
import { Product } from "@/types/product";
import { SortField } from "@/types/sortConfig";
import { ColumnConfig } from "@/types/table";
import { TableHeader as CustomTableHeader } from "./TableHeader";
import { TableCell as CustomTableCell } from "./TableCell";
import { SortControls } from "../sort/SortControls";

interface ProductsTableProps {
  products: Product[];
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30];

// Column configuration
const COLUMNS: ColumnConfig[] = [
  { field: "title", label: "Title", className: "title-col min-w-[150px]" },
  { field: "price", label: "Price", className: "price-col" },
  { field: "stock", label: "Stock", className: "stock-col" },
  { field: "rating", label: "Rating", className: "rating-col" },
  { field: "category", label: "Category", className: "category-col min-w-[120px]" },
];

export function ProductsTable({ products }: ProductsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { 
    sortConfigs, 
    multiSortMode, 
    handleSort, 
    toggleMultiSortMode, 
    clearSort, 
    removeSort, 
    moveSortPriority,
    getSortInfo, 
    sortData 
  } = useSort<Product>();

  const sortedProducts = sortData(products);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b space-y-3">
        {/* Header and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Products</h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Multi-sort toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={multiSortMode ? "default" : "outline"}
                size="sm"
                onClick={toggleMultiSortMode}
                className="flex items-center gap-2"
              >
                <Layers className="h-4 w-4" />
                Multi-sort
              </Button>
              {sortConfigs.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSort}
                  title="Clear all sorting"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Items per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Items per page:</span>
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
        
        {/* Active Sorts Display */}
        <SortControls
          sortConfigs={sortConfigs}
          multiSortMode={multiSortMode}
          onToggleMultiSort={toggleMultiSortMode}
          onClearSort={clearSort}
          onRemoveSort={(field) => removeSort(field as SortField)}
          onMoveSortPriority={(field, direction) => moveSortPriority(field as SortField, direction)}
        />
        
        {/* Instructions */}
        <div className="text-xs text-muted-foreground">
          {multiSortMode 
            ? "Multi-sort mode: Click arrows on column headers to add/modify sorts. Use priority controls to reorder."
            : "Single-sort mode: Click arrows on column headers to sort. Enable multi-sort mode to sort by multiple columns."
          }
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="image-col">Image</TableHead>
              {COLUMNS.map(column => (
                <CustomTableHeader
                  key={column.field}
                  column={column}
                  onSort={handleSort}
                  sortInfo={getSortInfo(column.field)}
                  multiSortMode={multiSortMode}
                />
              ))}
              <TableHead className="actions-col">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length + 2} className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src="/table.png"
                      alt="Empty table"
                      width={500}
                      height={500}
                      className="w-[500px] h-[500px] object-contain"
                    />
                    <p className="text-lg text-muted-foreground">WoW, an empty table!!!</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="image-col">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  </TableCell>
                  {COLUMNS.map(column => (
                    <CustomTableCell
                      key={column.field}
                      product={product}
                      field={column.field}
                      column={column}
                      sortInfo={getSortInfo(column.field)}
                    />
                  ))}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-3">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of {products.length} items
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || products.length === 0}
          >
            Previous
          </Button>
          <span className="text-sm px-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || products.length === 0}
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