import { TableCell as UITableCell } from "@/components/ui/table";
import { TableCellProps } from "@/types/table";

export function TableCell({ product, field, column, sortInfo }: TableCellProps) {
  const cellContent = {
    title: <div className="truncate max-w-[200px]" title={product.title}>{product.title}</div>,
    price: <span className="font-medium">${product.price.toFixed(2)}</span>,
    stock: <span className={product.stock < 10 ? "text-destructive font-medium" : ""}>{product.stock}</span>,
    rating: (
      <div className="flex items-center gap-1">
        <span>{product.rating.toFixed(1)}</span>
        <span className="text-muted-foreground">★</span>
      </div>
    ),
    category: <div className="truncate max-w-[120px]" title={product.category}>{product.category}</div>,
  }[field];
  

  return (
    <UITableCell 
      className={`${column.className} ${sortInfo.active ? "sorted-col" : ""}`}
    >
      {cellContent}
    </UITableCell>
  );
} 