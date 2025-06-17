import { useState } from 'react';
import { Product } from '@/types/product';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductDetailsProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetails({ product, open, onOpenChange }: ProductDetailsProps) {
  const [mainImage, setMainImage] = useState(product.thumbnail);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-background">
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="grid gap-6 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="aspect-square w-full rounded-lg object-cover"
                />
                <div className="grid grid-cols-4 gap-2">
                  {[product.thumbnail, ...product.images].map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(image)}
                      className={`aspect-square rounded-md overflow-hidden transition-opacity hover:opacity-80 ${
                        mainImage === image ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        loading="eager"
                        className="h-full w-full object-cover"
                        style={{ minHeight: '60px', minWidth: '60px' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Price</span>
                    <span className="text-sm">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Discount</span>
                    <span className="text-sm">{product.discountPercentage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rating</span>
                    <span className="text-sm">{product.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stock</span>
                    <span className="text-sm">{product.stock}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Brand</span>
                    <span className="text-sm">{product.brand}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Category</span>
                    <span className="text-sm">{product.category}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Dimensions</h3>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Width</span>
                      <span className="text-sm">{product.dimensions.width}cm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Height</span>
                      <span className="text-sm">{product.dimensions.height}cm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Depth</span>
                      <span className="text-sm">{product.dimensions.depth}cm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reviews</h3>
              <div className="grid gap-4">
                {product.reviews.map((review, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{review.reviewerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{review.rating}</span>
                        <span className="text-sm text-muted-foreground">/ 5</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 