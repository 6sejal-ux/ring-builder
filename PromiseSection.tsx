import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ShopifyProduct, parseMetafield, ProductGallery } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { pickProductImageForMetal, type MetalColor } from "@/lib/productImages";

interface ProductCardProps {
  product: ShopifyProduct;
  /** When set, prefer the variant image matching this metal color. */
  preferredMetal?: MetalColor;
}

export const ProductCard = ({ product, preferredMetal = null }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const { node } = product;
  const price = node.priceRange.minVariantPrice;
  const selectedVariant = node.variants.edges[0]?.node;

  // Pick image: prefers per-variant photo for the chosen metal, else front view.
  const displayImage = useMemo(() => {
    const gallery = parseMetafield<ProductGallery>(node.productGallery);
    return pickProductImageForMetal(node, preferredMetal, gallery);
  }, [node, preferredMetal]);


  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart", {
      description: node.title,
      position: "top-center",
    });
  };

  return (
    <Link to={`/product/${node.handle}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-card mb-3">
        {displayImage ? (
          <img
            src={displayImage.url}
            alt={displayImage.alt ?? node.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}
        <button
          onClick={handleAddToCart}
          disabled={isLoading || !selectedVariant?.availableForSale}
          className="absolute bottom-3 left-3 right-3 bg-primary text-primary-foreground py-2.5 text-xs tracking-[0.15em] uppercase font-body opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : !selectedVariant?.availableForSale ? (
            "Sold Out"
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
      <h3 className="font-heading text-lg font-medium">{node.title}</h3>
      <p className="text-xs text-muted-foreground font-body mb-1">{node.productType}</p>
      <p className="text-sm text-muted-foreground font-body">
        {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
      </p>
    </Link>
  );
};
