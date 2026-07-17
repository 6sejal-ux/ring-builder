import { useState } from "react";
import { X } from "lucide-react";

/* ROA-style filter bar: dark tab strip → expandable panel with visual swatches. */

const SETTINGS = [
  { label: "Solitaire", icon: "💎" },
  { label: "Halo", icon: "◎" },
  { label: "Hidden Halo", icon: "⊙" },
  { label: "Side Stone", icon: "◇" },
  { label: "Pave", icon: "✦" },
  { label: "Bezel", icon: "○" },
  { label: "Twisted", icon: "∽" },
  { label: "Nature Inspired", icon: "🌿" },
  { label: "Toi Et Moi", icon: "◐" },
];

const HEIGHTS = [
  { label: "High Set", icon: "↑" },
  { label: "Low Set", icon: "↓" },
];

const BANDS = [
  { label: "Twisted", icon: "〰" },
  { label: "Plain", icon: "—" },
  { label: "Pave", icon: "✦" },
];

const SHAPES = [
  { label: "Round", icon: "●" },
  { label: "Oval", icon: "⬮" },
  { label: "Cushion", icon: "▢" },
  { label: "Princess", icon: "◆" },
  { label: "Emerald", icon: "▭" },
  { label: "Pear", icon: "◈" },
  { label: "Radiant", icon: "❖" },
  { label: "Asscher", icon: "□" },
  { label: "Heart", icon: "♥" },
  { label: "Marquise", icon: "◇" },
];

interface MetalOption {
  label: string;
  karat: string;
  color: string;
  bg: string;
}

const METALS: MetalOption[] = [
  { label: "9K White",   karat: "9K",  color: "White",  bg: "linear-gradient(135deg,#f4f4f4,#d8d8d8 55%,#bcbcbc)" },
  { label: "14K White",  karat: "14K", color: "White",  bg: "linear-gradient(135deg,#ececec,#cfcfcf 55%,#a8a8a8)" },
  { label: "18K White",  karat: "18K", color: "White",  bg: "linear-gradient(135deg,#e3e3e3,#bdbdbd 55%,#959595)" },
  { label: "9K Yellow",  karat: "9K",  color: "Yellow", bg: "linear-gradient(135deg,#f7e08c,#e5c14a 55%,#b3902a)" },
  { label: "14K Yellow", karat: "14K", color: "Yellow", bg: "linear-gradient(135deg,#f4d168,#dca627 55%,#9a6f17)" },
  { label: "18K Yellow", karat: "18K", color: "Yellow", bg: "linear-gradient(135deg,#efc043,#c89014 55%,#7d5a0c)" },
  { label: "9K Rose",    karat: "9K",  color: "Rose",   bg: "linear-gradient(135deg,#f5c8b8,#e09b85 55%,#b76e57)" },
  { label: "14K Rose",   karat: "14K", color: "Rose",   bg: "linear-gradient(135deg,#eaa896,#d07c64 55%,#9a5340)" },
  { label: "18K Rose",   karat: "18K", color: "Rose",   bg: "linear-gradient(135deg,#dd8e7a,#b8624a 55%,#7d3d2c)" },
  { label: "Platinum",   karat: "PT",  color: "Platinum", bg: "linear-gradient(135deg,#eef0f3,#c9ced4 55%,#9aa0a8)" },
];

const FILTER_TABS = ["Setting Style", "Metal", "Shape", "Price", "View All"] as const;
type FilterTab = typeof FILTER_TABS[number];
export { FILTER_TABS };
export type { FilterTab };

export interface SettingFiltersProps {
  activeTab?: FilterTab;
  setActiveTab?: (t: FilterTab) => void;

  selectedStyles: string[];
  setSelectedStyles: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMetals: string[];
  setSelectedMetals: React.Dispatch<React.SetStateAction<string[]>>;
  selectedShapes: string[];
  setSelectedShapes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedHeights?: string[];
  setSelectedHeights?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedBands?: string[];
  setSelectedBands?: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
}

/* Swatch pill (icon in a circle + label under) */
const Swatch = ({
  active, onClick, label, children, size = "md",
}: {
  active: boolean; onClick: () => void; label: string;
  children: React.ReactNode; size?: "md" | "lg";
}) => {
  const dim = size === "lg" ? "w-16 h-16 md:w-[72px] md:h-[72px]" : "w-14 h-14 md:w-16 md:h-16";
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 shrink-0 group"
      title={label}
    >
      <span
        className={`${dim} rounded-full flex items-center justify-center bg-card border transition-all overflow-hidden
          ${active
            ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
            : "border-border group-hover:border-foreground/40"}`}
      >
        {children}
      </span>
      <span className={`text-[11px] font-body tracking-wide text-center leading-tight max-w-[92px]
        ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
        {label}
      </span>
    </button>
  );
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[11px] tracking-[0.25em] uppercase text-foreground/70 font-body mb-4">
    {children}
  </h3>
);

export const SettingFilters = ({
  activeTab: activeTabProp,
  setActiveTab: setActiveTabProp,
  selectedStyles, setSelectedStyles,
  selectedMetals, setSelectedMetals,
  selectedShapes, setSelectedShapes,
  selectedHeights = [], setSelectedHeights,
  selectedBands = [], setSelectedBands,
  priceRange, setPriceRange,
}: SettingFiltersProps) => {
  const [internalTab, setInternalTab] = useState<FilterTab>("View All");
  const activeTab = activeTabProp ?? internalTab;
  const setActiveTab = setActiveTabProp ?? setInternalTab;

  const toggle = (
    arr: string[], val: string,
    setter?: React.Dispatch<React.SetStateAction<string[]>>
  ) => setter && setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const allActive = [
    ...selectedStyles, ...selectedHeights, ...selectedBands, ...selectedShapes, ...selectedMetals,
  ];
  const priceActive = priceRange[0] > 0 || priceRange[1] < 20000;
  const hasFilters = allActive.length > 0 || priceActive;

  const clearAll = () => {
    setSelectedStyles([]);
    setSelectedShapes([]);
    setSelectedMetals([]);
    setSelectedHeights?.([]);
    setSelectedBands?.([]);
    setPriceRange([0, 20000]);
  };

  const removeFilter = (val: string) => {
    setSelectedStyles((p) => p.filter((v) => v !== val));
    setSelectedShapes((p) => p.filter((v) => v !== val));
    setSelectedMetals((p) => p.filter((v) => v !== val));
    setSelectedHeights?.((p) => p.filter((v) => v !== val));
    setSelectedBands?.((p) => p.filter((v) => v !== val));
  };

  const showStyle = activeTab === "Setting Style" || activeTab === "View All";
  const showMetal = activeTab === "Metal" || activeTab === "View All";
  const showShape = activeTab === "Shape" || activeTab === "View All";
  const showPrice = activeTab === "Price" || activeTab === "View All";

  return (
    <div className="container pb-6">
      {/* Dark filter tab bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border border-primary rounded-md overflow-hidden mb-6">
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab;
          const isViewAll = tab === "View All";
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-4 md:py-5 text-[11px] md:text-xs tracking-[0.2em] uppercase font-body transition-colors border-r border-primary/20 last:border-r-0 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isViewAll
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Title row + Reset */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-3xl md:text-4xl font-light text-primary">
          Engagement Rings
        </h2>
        <button
          onClick={clearAll}
          className="px-6 py-3 text-xs tracking-[0.2em] uppercase font-body bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-sm"
        >
          Reset
        </button>
      </div>

      {/* Panels */}
      {showStyle && (
        <div className="mb-8">
          <SectionHeading>Setting Style <span className="text-muted-foreground/60">ⓘ</span></SectionHeading>
          <div className="flex gap-3 md:gap-5 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: "none" }}>
            {SETTINGS.map((s) => (
              <Swatch
                key={s.label}
                size="lg"
                label={s.label}
                active={selectedStyles.includes(s.label)}
                onClick={() => toggle(selectedStyles, s.label, setSelectedStyles)}
              >
                <span className="text-2xl">{s.icon}</span>
              </Swatch>
            ))}
          </div>

          {activeTab === "View All" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <SectionHeading>Setting Height</SectionHeading>
                <div className="flex gap-4">
                  {HEIGHTS.map((h) => (
                    <Swatch
                      key={h.label}
                      label={h.label}
                      active={selectedHeights.includes(h.label)}
                      onClick={() => toggle(selectedHeights, h.label, setSelectedHeights)}
                    >
                      <span className="text-xl">{h.icon}</span>
                    </Swatch>
                  ))}
                </div>
              </div>
              <div>
                <SectionHeading>Band Type</SectionHeading>
                <div className="flex gap-4">
                  {BANDS.map((b) => (
                    <Swatch
                      key={b.label}
                      label={b.label}
                      active={selectedBands.includes(b.label)}
                      onClick={() => toggle(selectedBands, b.label, setSelectedBands)}
                    >
                      <span className="text-xl">{b.icon}</span>
                    </Swatch>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showShape && (
        <div className="mb-8">
          <SectionHeading>Shape <span className="text-muted-foreground/60">ⓘ</span></SectionHeading>
          <div className="flex gap-3 md:gap-5 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: "none" }}>
            {SHAPES.map((s) => (
              <Swatch
                key={s.label}
                size="lg"
                label={s.label}
                active={selectedShapes.includes(s.label)}
                onClick={() => toggle(selectedShapes, s.label, setSelectedShapes)}
              >
                <span className="text-2xl">{s.icon}</span>
              </Swatch>
            ))}
          </div>
        </div>
      )}

      {showMetal && (
        <div className="mb-8">
          <SectionHeading>Metal <span className="text-muted-foreground/60">ⓘ</span></SectionHeading>
          <div className="flex gap-3 md:gap-5 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: "none" }}>
            {METALS.map((m) => {
              const active = selectedMetals.includes(m.label);
              return (
                <Swatch
                  key={m.label}
                  label={`${m.karat} ${m.color}`}
                  active={active}
                  onClick={() => toggle(selectedMetals, m.label, setSelectedMetals)}
                >
                  <span
                    className="w-full h-full flex flex-col items-center justify-center text-[9px] font-body tracking-wider"
                    style={{ background: m.bg, color: m.color === "Yellow" || m.color === "Rose" ? "#fff" : "#3a3a3a" }}
                  >
                    <span className="font-semibold leading-none">{m.karat}</span>
                    <span className="uppercase opacity-80 leading-none mt-0.5">{m.color}</span>
                  </span>
                </Swatch>
              );
            })}
          </div>
        </div>
      )}

      {showPrice && (
        <div className="mb-8 max-w-2xl">
          <SectionHeading>Price</SectionHeading>
          <div className="flex items-center gap-4">
            <input
              type="range" min={0} max={20000} step={100}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1 accent-primary"
            />
            <div className="px-4 py-2 border border-border font-body text-sm min-w-[110px] text-center rounded-sm">
              ${priceRange[1].toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-border">
          {allActive.map((f) => (
            <button
              key={f}
              onClick={() => removeFilter(f)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-body text-primary hover:opacity-70 transition-opacity"
            >
              <span>{f}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          ))}
          {priceActive && (
            <span className="px-3 py-1.5 text-xs font-body text-primary">
              ${priceRange[0].toLocaleString()} – ${priceRange[1].toLocaleString()}
            </span>
          )}
          <button
            onClick={clearAll}
            className="text-xs font-body text-primary underline underline-offset-4 ml-auto"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
