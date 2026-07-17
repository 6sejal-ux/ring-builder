import { useState } from "react";
import { useRingBuilderStore } from "@/stores/ringBuilderStore";
import { parseMetafield, ProductGallery } from "@/lib/shopify";
import { ShoppingBag, RotateCcw, ChevronLeft, Gem, Diamond, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const ReviewStep = () => {
  const { selectedSetting, selectedSettingVariantIdx, selectedDiamond, totalPrice, reset, setStep } = useRingBuilderStore();
  const [checkingOut, setCheckingOut] = useState(false);

  if (!selectedSetting || !selectedDiamond) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-heading text-2xl mb-2">Complete Previous Steps</h3>
        <p className="text-muted-foreground font-body">Select both a setting and a diamond to review your ring.</p>
      </div>
    );
  }

  const { node } = selectedSetting;
  const variant = node.variants.edges[selectedSettingVariantIdx]?.node;
  const settingPrice = parseFloat(variant?.price.amount || "0");

  const gallery = parseMetafield<ProductGallery>(node.productGallery);
  const image = gallery?.images?.[0]?.url || node.images.edges[0]?.node.url;

  const handleCheckout = async () => {
    if (!variant) return;
    setCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-draft-order", {
        body: {
          settingVariantId: variant.id,
          settingTitle: `${node.title} — ${variant.title}`,
          diamond: selectedDiamond,
        },
      });
      if (error) throw error;
      if (data?.invoiceUrl) {
        toast.success("Redirecting to secure checkout…", { position: "top-center" });
        window.open(data.invoiceUrl, "_blank");
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (e: any) {
      console.error("Checkout error:", e);
      toast.error("Checkout failed", { description: e.message ?? "Please try again.", position: "top-center" });
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="container pb-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-2">Your Custom Ring</h2>
        <p className="text-center text-muted-foreground font-body text-sm mb-10">
          Review your selections below before proceeding to checkout.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="border border-border p-6 bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Diamond className="w-4 h-4 text-accent" />
              <h3 className="text-[10px] tracking-[0.15em] uppercase font-body text-muted-foreground">Setting</h3>
            </div>
            {image && (
              <div className="aspect-square overflow-hidden bg-muted mb-4">
                <img src={image} alt={node.title} className="w-full h-full object-cover" />
              </div>
            )}
            <h4 className="font-heading text-xl mb-1">{node.title}</h4>
            <p className="text-xs text-muted-foreground font-body mb-2">{variant?.title}</p>
            <p className="font-heading text-lg">${settingPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <button onClick={() => setStep(0)} className="mt-3 text-[10px] uppercase tracking-wider font-body text-primary hover:underline flex items-center gap-1">
              <ChevronLeft className="w-3 h-3" /> Change Setting
            </button>
          </div>

          <div className="border border-border p-6 bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Gem className="w-4 h-4 text-accent" />
              <h3 className="text-[10px] tracking-[0.15em] uppercase font-body text-muted-foreground">Diamond</h3>
            </div>
            <div className="aspect-square overflow-hidden bg-muted mb-4 flex items-center justify-center">
              {selectedDiamond.imageUrl ? (
                <img src={selectedDiamond.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Gem className="w-24 h-24 text-muted-foreground/30" />
              )}
            </div>
            <h4 className="font-heading text-xl mb-1 capitalize">
              {selectedDiamond.carat}ct {selectedDiamond.shape.toLowerCase()}
            </h4>
            <p className="text-xs text-muted-foreground font-body mb-1">
              Color: {selectedDiamond.color} • Clarity: {selectedDiamond.clarity} • Cut: {selectedDiamond.cut}
            </p>
            <p className="text-xs text-muted-foreground font-body mb-2">
              Certificate: {selectedDiamond.certificate}
            </p>
            <p className="font-heading text-lg">${selectedDiamond.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <button onClick={() => setStep(1)} className="mt-3 text-[10px] uppercase tracking-wider font-body text-primary hover:underline flex items-center gap-1">
              <ChevronLeft className="w-3 h-3" /> Change Diamond
            </button>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.15em] uppercase font-body text-muted-foreground mb-1">Total Price</p>
              <p className="font-heading text-3xl md:text-4xl">${totalPrice().toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={reset}
                className="flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-body border border-border hover:bg-muted transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Start Over
              </button>
              <button onClick={handleCheckout} disabled={checkingOut}
                className="flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-wider font-body bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                {checkingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                {checkingOut ? "Preparing…" : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
