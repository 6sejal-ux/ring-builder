import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { Loader2, Package } from "lucide-react";

export const ProductGrid = () => {
  const { data: products, isLoading, error } = useProducts(20);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-3 font-body">
            Our Collection
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-light">
            Shop All Jewelry
          </h2>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-muted-foreground">
            <p>Something went wrong loading products.</p>
          </div>
        )}

        {!isLoading && !error && products && products.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-2xl mb-2">No Products Yet</h3>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              Your store doesn't have any products yet. Add products through the chat to see them here!
            </p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
