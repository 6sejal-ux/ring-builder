import { useState, useEffect } from "react";
import { useRingBuilderStore, SelectedDiamond } from "@/stores/ringBuilderStore";
import { Gem, ArrowRight, Loader2, Play } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

const SHAPES = ["All", "ROUND", "OVAL", "CUSHION", "PRINCESS", "EMERALD", "PEAR", "MARQUISE", "RADIANT", "HEART", "ASSCHER"];
const COLORS = ["D", "E", "F", "G", "H", "I", "J"];
const CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];

interface NivodaItem {
  id: string;
  video: string | null;
  image: string | null;
  price: number;
  discount?: number;
  certificate: {
    lab: string;
    shape: string;
    certNumber: string;
    cut: string;
    carats: number;
    clarity: string;
    color: string;
  };
}

export const DiamondStep = () => {
  const { selectDiamond, selectedSetting } = useRingBuilderStore();
  const [shapeFilter, setShapeFilter] = useState("All");
  const [caratRange, setCaratRange] = useState<[number, number]>([0.5, 3]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [colorFilter, setColorFilter] = useState<string[]>(["D", "E", "F", "G"]);
  const [clarityFilter, setClarityFilter] = useState<string[]>(["VVS1", "VVS2", "VS1", "VS2"]);
  const [diamonds, setDiamonds] = useState<NivodaItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFilter = (list: string[], setList: (v: string[]) => void, val: string) => {
    setList(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);
  };

  const fetchDiamonds = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("nivoda-search", {
        body: {
          shapes: shapeFilter === "All" ? undefined : [shapeFilter],
          caratMin: caratRange[0],
          caratMax: caratRange[1],
          priceMin: priceRange[0],
          priceMax: priceRange[1],
          colors: colorFilter.length ? colorFilter : undefined,
          clarities: clarityFilter.length ? clarityFilter : undefined,
          labs: ["IGI", "GIA"],
          offset: 0,
          limit: 30,
          labGrown: true,
        },
      });
      if (error) throw error;
      setDiamonds(data?.items ?? []);
      setTotalCount(data?.total_count ?? 0);
    } catch (e: any) {
      console.error("Nivoda fetch error:", e);
      setError(e.message ?? "Failed to load diamonds");
      setDiamonds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiamonds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (d: NivodaItem) => {
    const sel: SelectedDiamond = {
      id: d.id,
      shape: d.certificate.shape,
      carat: d.certificate.carats,
      color: d.certificate.color,
      clarity: d.certificate.clarity,
      cut: d.certificate.cut,
      price: d.price,
      imageUrl: d.image ?? undefined,
      certificate: d.certificate.lab,
    };
    selectDiamond(sel);
  };

  if (!selectedSetting) {
    return (
      <div className="container py-20 text-center">
        <Gem className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-heading text-2xl mb-2">Select a Setting First</h3>
        <p className="text-muted-foreground font-body">Please choose your ring setting in Step 1 before selecting a diamond.</p>
      </div>
    );
  }

  return (
    <div className="container pb-16">
      <div className="border border-accent/30 bg-accent/5 p-4 mb-6 flex items-center gap-3">
        <Gem className="w-5 h-5 text-accent flex-shrink-0" />
        <div>
          <p className="text-sm font-body font-medium text-foreground">Live Diamond Inventory — Nivoda</p>
          <p className="text-xs text-muted-foreground font-body">
            Lab-grown, certified diamonds. Prices in USD.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-[10px] tracking-[0.15em] uppercase font-body text-muted-foreground mb-3">Shape</h4>
          <div className="flex flex-wrap gap-2">
            {SHAPES.map((s) => (
              <button key={s} onClick={() => setShapeFilter(s)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-body border transition-colors ${
                  shapeFilter === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-foreground/30"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-[10px] tracking-[0.15em] uppercase font-body text-muted-foreground mb-3">Carat</h4>
            <Slider min={0.3} max={5} step={0.1} value={caratRange} onValueChange={(v) => setCaratRange(v as [number, number])} className="mb-2" />
            <div className="flex justify-between text-xs font-body text-muted-foreground">
              <span>{caratRange[0].toFixed(1)} ct</span>
              <span>{caratRange[1].toFixed(1)} ct</span>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.15em] uppercase font-body text-muted-foreground mb-3">Price</h4>
            <Slider min={0} max={50000} step={500} value={priceRange} onValueChange={(v) => setPriceRange(v as [number, number])} className="mb-2" />
            <div className="flex justify-between text-xs font-body text-muted-foreground">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] tracking-[0.15em] uppercase font-body text-muted-foreground mb-3">Color</h4>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button key={c} onClick={() => toggleFilter(colorFilter, setColorFilter, c)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-body border transition-colors ${
                  colorFilter.includes(c) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-foreground/30"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] tracking-[0.15em] uppercase font-body text-muted-foreground mb-3">Clarity</h4>
          <div className="flex flex-wrap gap-2">
            {CLARITIES.map((c) => (
              <button key={c} onClick={() => toggleFilter(clarityFilter, setClarityFilter, c)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-body border transition-colors ${
                  clarityFilter.includes(c) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-foreground/30"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={fetchDiamonds} disabled={loading}
          className="px-6 py-2 text-xs uppercase tracking-wider font-body bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Apply Filters
        </button>
      </div>

      {error && (
        <div className="border border-destructive/40 bg-destructive/5 text-destructive p-4 mb-4 text-sm font-body">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="border border-border">
        <div className="hidden md:grid grid-cols-8 gap-2 px-4 py-3 bg-muted text-[10px] tracking-[0.12em] uppercase font-body text-muted-foreground border-b border-border">
          <span>Media</span>
          <span>Shape</span>
          <span>Carat</span>
          <span>Color</span>
          <span>Clarity</span>
          <span>Cut</span>
          <span>Price</span>
          <span></span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-body">Loading diamonds…</p>
          </div>
        ) : diamonds.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground font-body text-sm">
            No diamonds match your criteria. Try widening filters.
          </div>
        ) : (
          diamonds.map((d) => (
            <div key={d.id} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
              <div className="hidden md:grid grid-cols-8 gap-2 px-4 py-3 items-center">
                <div className="w-12 h-12 bg-muted flex items-center justify-center overflow-hidden">
                  {d.image ? (
                    <img src={d.image} alt={d.certificate.shape} className="w-full h-full object-cover" />
                  ) : d.video ? (
                    <Play className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Gem className="w-5 h-5 text-muted-foreground/40" />
                  )}
                </div>
                <span className="text-sm font-body capitalize">{d.certificate.shape.toLowerCase()}</span>
                <span className="text-sm font-body">{d.certificate.carats.toFixed(2)}</span>
                <span className="text-sm font-body">{d.certificate.color}</span>
                <span className="text-sm font-body">{d.certificate.clarity}</span>
                <span className="text-sm font-body">{d.certificate.cut}</span>
                <span className="text-sm font-heading font-medium">${Number(d.price).toLocaleString()}</span>
                <button onClick={() => handleSelect(d)}
                  className="flex items-center gap-1 px-3 py-1.5 text-[10px] uppercase tracking-wider font-body bg-primary text-primary-foreground hover:bg-primary/90 transition-colors justify-center">
                  Select <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="md:hidden p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {d.image ? <img src={d.image} alt="" className="w-full h-full object-cover" /> : <Gem className="w-6 h-6 text-muted-foreground/40" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-heading text-base capitalize">{d.certificate.shape.toLowerCase()} • {d.certificate.carats.toFixed(2)} ct</p>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">
                      {d.certificate.color} • {d.certificate.clarity} • {d.certificate.cut} • {d.certificate.lab}
                    </p>
                    <p className="text-base font-heading font-medium mt-1">${Number(d.price).toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => handleSelect(d)}
                  className="w-full flex items-center justify-center gap-1 px-3 py-2 text-[10px] uppercase tracking-wider font-body bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Select <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && diamonds.length > 0 && (
        <p className="text-xs text-muted-foreground font-body mt-4 text-center">
          Showing {diamonds.length} of {totalCount.toLocaleString()} available diamonds
        </p>
      )}
    </div>
  );
};
