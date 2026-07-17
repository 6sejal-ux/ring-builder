import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, STOREFRONT_PRODUCT_BY_HANDLE_QUERY, ShopifyProduct, parseMetafield, ProductDetails, ProductGallery, ProductVideos } from "@/lib/shopify";
import { getProductVideos } from "@/lib/productMedia";
import { useCartStore } from "@/stores/cartStore";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { ProductMediaGallery } from "@/components/ProductMediaGallery";
import { MetalSelector } from "@/components/MetalSelector";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const addItem = useCartStore(state => state.addItem);
  const isCartLoading = useCartStore(state => state.isLoading);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['shopify-product', handle],
    queryFn: async () => {
      const data = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle });
      const p = data?.data?.productByHandle;
      if (!p) return null;
      return { node: p } as ShopifyProduct;
    },
    enabled: !!handle,
  });

  const details = useMemo(() => product ? parseMetafield<ProductDetails>(product.node.productDetails) : null, [product]);
  const gallery = useMemo(() => product ? parseMetafield<ProductGallery>(product.node.productGallery) : null, [product]);
  const productVideos = useMemo(() => product ? parseMetafield<ProductVideos>(product.node.productVideos) : null, [product]);

  // Prefer imported Shopify metafield videos; fall back to local mapping for older imports.
  const videoInfo = useMemo(() => {
    if (productVideos?.videos?.length) {
      return {
        videos: productVideos.videos.map((video) => ({
          url: video.url,
          label: video.label || video.alt || video.metal || "Video",
        })),
      };
    }
    if (!product) return { videos: [] };
    const skus = product.node.variants.edges.map(v => {
      // Extract SKU from variant title or use variant ID
      // Shopify variants have SKUs in the admin, but Storefront API doesn't expose them
      // We'll try to match using the product handle
      return v.node.id;
    });
    // Try matching by handle-based SKU extraction
    const handleParts = handle?.split('-') || [];
    // Reconstruct potential CSV SKU from handle
    // Handle format: "antique-style-ring-84672-8-0-rd" → SKU: "84672-8.0 RD"
    const possibleSkus: string[] = [];
    // Try various SKU patterns from handle
    for (let i = 0; i < handleParts.length; i++) {
      if (/^\d{4,6}$/.test(handleParts[i])) {
        // Found numeric part - reconstruct SKU
        const remaining = handleParts.slice(i).join('-');
        possibleSkus.push(remaining.replace(/-/g, ' ').toUpperCase());
        possibleSkus.push(remaining);
        // Also try with dots: "8-0" -> "8.0"
        const withDots = remaining.replace(/(\d)-(\d)/g, '$1.$2');
        possibleSkus.push(withDots.toUpperCase());
        possibleSkus.push(withDots);
        // Try with E suffix variants
        if (handleParts[i + 1] === 'e' || handleParts[i + 1] === 'w') {
          const skuBase = handleParts[i] + '-' + handleParts[i + 1].toUpperCase();
          const sizeRest = handleParts.slice(i + 2).join('-').replace(/(\d)-(\d)/g, '$1.$2');
          possibleSkus.push(`${skuBase}-${sizeRest}`.toUpperCase());
          possibleSkus.push(`${skuBase} ${sizeRest}`.toUpperCase());
          possibleSkus.push(`${skuBase}-${sizeRest}`);
        }
        break;
      }
    }
    return getProductVideos(possibleSkus);
  }, [product, productVideos, handle]);

  if (isLoading) {
    return (
      <>
        <StoreHeader />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
        <StoreFooter />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <StoreHeader />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground font-body">Product not found.</p>
        </div>
        <StoreFooter />
      </>
    );
  }

  const { node } = product;
  const variants = node.variants.edges;
  const selectedVariant = variants[selectedVariantIdx]?.node;

  const allImages = gallery?.images?.length
    ? gallery.images.map(img => ({ url: img.url, alt: img.alt || node.title }))
    : node.images.edges.map(e => ({ url: e.node.url, alt: e.node.altText || node.title }));

  const handleAddToCart = async () => {
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
    <>
      <StoreHeader />
      <main className="container py-8 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
          {/* Media Gallery */}
          <ProductMediaGallery
            images={allImages}
            videos={videoInfo.videos}
          />

          {/* Product Info */}
          <div className="flex flex-col justify-start">
            {node.productType && (
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2 font-body">
                {node.productType}
              </p>
            )}
            <h1 className="font-heading text-3xl md:text-4xl font-medium mb-3">{node.title}</h1>
            <p className="font-heading text-2xl mb-8">
              {selectedVariant?.price.currencyCode}{' '}
              {parseFloat(selectedVariant?.price.amount || '0').toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>

            {/* Metal / Variant Selector */}
            <div className="mb-8">
              <MetalSelector
                options={node.options}
                variants={variants}
                selectedVariantIdx={selectedVariantIdx}
                onSelectVariant={setSelectedVariantIdx}
              />
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isCartLoading || !selectedVariant?.availableForSale}
              className="w-full bg-primary text-primary-foreground py-3.5 text-sm tracking-[0.2em] uppercase font-body hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-8"
            >
              {isCartLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : !selectedVariant?.availableForSale ? (
                "Sold Out"
              ) : (
                "Add to Cart"
              )}
            </button>

            {/* Description */}
            {(details?.description || node.description) && (
              <div className="mb-5 border-t border-border pt-5">
                <h3 className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-body mb-3">Description</h3>
                <p className="text-sm text-foreground/80 font-body leading-relaxed">
                  {details?.description || node.description}
                </p>
              </div>
            )}

            {/* Features */}
            {details?.features && details.features.length > 0 && (
              <div className="mb-5 border-t border-border pt-5">
                <h3 className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-body mb-3">Features</h3>
                <ul className="list-disc list-inside text-sm text-foreground/80 font-body space-y-1">
                  {details.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}

            {/* Materials */}
            {details?.materials && details.materials.length > 0 && (
              <div className="border-t border-border pt-5">
                <h3 className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-body mb-3">Materials</h3>
                <ul className="list-disc list-inside text-sm text-foreground/80 font-body space-y-1">
                  {details.materials.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      <StoreFooter />
    </>
  );
};

export default ProductDetail;
