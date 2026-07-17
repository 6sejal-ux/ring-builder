import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { SettingFilters, type FilterTab } from "./SettingFilters";
import { Loader2, Package } from "lucide-react";
import { detectMetalColor } from "@/lib/productImages";


const normalizeFilterValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/\bkt\b/g, "k")
    .replace(/\bkarat\b/g, "k")
    .replace(/\bgold\b/g, "")
    .replace(/\bplatinum\b/g, "pt")
    .replace(/\bpt\b/g, "pt")
    .replace(/\bwg\b/g, "white")
    .replace(/\byg\b/g, "yellow")
    .replace(/\brg\b/g, "rose")
    .replace(/[-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getOptionValues = (options: Array<{ name: string; values: string[] }>, optionName: string) => {
  const target = normalizeFilterValue(optionName);
  return options.find((o) => normalizeFilterValue(o.name).includes(target) || target.includes(normalizeFilterValue(o.name)))?.values ?? [];
};

const tokenize = (s: string) => normalizeFilterValue(s).split(" ").filter(Boolean);

const matchesSelectedOption = (optionValues: string[], selectedValues: string[]) =>
  selectedValues.some((sv) => {
    const sTokens = tokenize(sv);
    return optionValues.some((ov) => {
      const oNorm = normalizeFilterValue(ov);
      // every meaningful token in the selection must appear in the option value
      return sTokens.every((t) => oNorm.includes(t));
    });
  });

const matchesInText = (text: string, selectedValues: string[]) => {
  const norm = normalizeFilterValue(text);
  return selectedValues.some((sv) => tokenize(sv).every((t) => norm.includes(t)));
};

/** Read a Shopify metafield that may be a single string, JSON array, or list-type JSON. */
const readMetafieldList = (mf: { value: string; type: string } | null | undefined): string[] => {
  if (!mf?.value) return [];
  const v = mf.value.trim();
  if (v.startsWith("[")) {
    try {
      const arr = JSON.parse(v);
      if (Array.isArray(arr)) return arr.map((x) => String(x));
    } catch { /* fall through */ }
  }
  // comma or pipe separated
  return v.split(/[,|]/).map((s) => s.trim()).filter(Boolean);
};

const matchesMetafield = (values: string[], selectedValues: string[]) => {
  if (!values.length) return false;
  const normValues = values.map(normalizeFilterValue);
  return selectedValues.some((sv) => {
    const sTokens = tokenize(sv);
    return normValues.some((nv) => sTokens.every((t) => nv.includes(t)));
  });
};

/** Tags-only matcher for Setting / Setting Height / Band Type. */
const matchesTags = (tags: string[], selectedValues: string[]) => {
  if (!tags.length) return false;
  const norm = tags.map(normalizeFilterValue);
  return selectedValues.some((sv) => {
    const sTokens = tokenize(sv);
    return norm.some((t) => sTokens.every((tok) => t.includes(tok)));
  });
};

export const SettingStep = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("View All");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedMetals, setSelectedMetals] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedHeights, setSelectedHeights] = useState<string[]>([]);
  const [selectedBands, setSelectedBands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState("price-asc");

  // Pull both legacy "setting" products and new Southern Star Engagement Rings
  const { data: products, isLoading } = useProducts(
    250,
    "product_type:setting OR product_type:'Engagement Ring' OR tag:type:engagement-ring"
  );

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    result = result.filter((p) => {
      const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // ----- Metafield-driven facets: Shape & Metal -----
    if (selectedMetals.length > 0) {
      result = result.filter((p) => {
        const meta = readMetafieldList(p.node.metalMeta);
        if (meta.length && matchesMetafield(meta, selectedMetals)) return true;
        // Fallbacks: variant option "Metal", then tags
        const opts = getOptionValues(p.node.options, "Metal");
        if (opts.length && matchesSelectedOption(opts, selectedMetals)) return true;
        return matchesTags(p.node.tags, selectedMetals);
      });
    }
    if (selectedShapes.length > 0) {
      result = result.filter((p) => {
        const meta = readMetafieldList(p.node.shapeMeta);
        if (meta.length && matchesMetafield(meta, selectedShapes)) return true;
        const opts = getOptionValues(p.node.options, "Shape");
        if (opts.length && matchesSelectedOption(opts, selectedShapes)) return true;
        return matchesTags(p.node.tags, selectedShapes);
      });
    }

    // ----- Tag-only facets: Setting / Setting Height / Band Type -----
    if (selectedStyles.length > 0) {
      result = result.filter((p) => matchesTags(p.node.tags, selectedStyles));
    }
    if (selectedHeights.length > 0) {
      result = result.filter((p) => matchesTags(p.node.tags, selectedHeights));
    }
    if (selectedBands.length > 0) {
      result = result.filter((p) =>
        matchesTags(p.node.tags, selectedBands.map((b) => `${b}-band`).concat(selectedBands))
      );
    }

    if (sortBy === "price-asc") result.sort((a, b) => parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount));
    else if (sortBy === "price-desc") result.sort((a, b) => parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount));
    else if (sortBy === "name") result.sort((a, b) => a.node.title.localeCompare(b.node.title));

    return result;
  }, [products, priceRange, selectedMetals, selectedStyles, selectedShapes, selectedHeights, selectedBands, sortBy]);

  return (
    <>
      <SettingFilters
        activeTab={activeTab} setActiveTab={setActiveTab}
        selectedStyles={selectedStyles} setSelectedStyles={setSelectedStyles}
        selectedMetals={selectedMetals} setSelectedMetals={setSelectedMetals}
        selectedShapes={selectedShapes} setSelectedShapes={setSelectedShapes}
        selectedHeights={selectedHeights} setSelectedHeights={setSelectedHeights}
        selectedBands={selectedBands} setSelectedBands={setSelectedBands}
        priceRange={priceRange} setPriceRange={setPriceRange}
      />

      <div className="container pb-16">
        {/* Count + divider line + sort — ROA style */}
        <div className="flex items-center gap-4 mb-8">
          <p className="font-body text-sm md:text-base whitespace-nowrap">
            Settings Found <span className="font-semibold">({filteredProducts.length})</span>
          </p>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs md:text-sm font-body text-muted-foreground">Sort By :</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="text-xs md:text-sm font-body bg-transparent border-0 focus:outline-none text-primary font-medium cursor-pointer">
              <option value="price-asc">Price - Low to High</option>
              <option value="price-desc">Price - High to Low</option>
              <option value="name">Name: A → Z</option>
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-2xl mb-2">No Settings Found</h3>
            <p className="text-muted-foreground font-body max-w-md mx-auto">Try adjusting your filters to see more results.</p>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, idx) => (
              <div
                key={product.node.id}
                className="bg-card rounded-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow relative"
              >
                {idx < 8 && (
                  <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[10px] tracking-[0.15em] uppercase font-body font-medium text-white"
                    style={{ background: "linear-gradient(90deg,#7d3d8a,#3a4a9e)" }}>
                    Top Selling
                  </span>
                )}
                <div className="bg-white">
                  <ProductCard
                    product={product}
                    preferredMetal={detectMetalColor(selectedMetals[0])}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
