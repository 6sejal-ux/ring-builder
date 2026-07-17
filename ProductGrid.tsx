interface MetalSelectorProps {
  options: Array<{ name: string; values: string[] }>;
  variants: Array<{
    node: {
      selectedOptions: Array<{ name: string; value: string }>;
      availableForSale: boolean;
    };
  }>;
  selectedVariantIdx: number;
  onSelectVariant: (idx: number) => void;
}

const METAL_COLORS: Record<string, { bg: string; ring: string; label: string }> = {
  'white gold': { bg: 'bg-gradient-to-br from-gray-100 to-gray-300', ring: 'ring-gray-400', label: 'WG' },
  'yellow gold': { bg: 'bg-gradient-to-br from-yellow-300 to-yellow-500', ring: 'ring-yellow-500', label: 'YG' },
  'rose gold': { bg: 'bg-gradient-to-br from-pink-200 to-pink-400', ring: 'ring-pink-400', label: 'RG' },
  'platinum': { bg: 'bg-gradient-to-br from-slate-200 to-slate-400', ring: 'ring-slate-400', label: 'PT' },
};

function getMetalStyle(value: string) {
  const lower = value.toLowerCase();
  for (const [key, style] of Object.entries(METAL_COLORS)) {
    if (lower.includes(key)) return style;
  }
  return null;
}

export const MetalSelector = ({ options, variants, selectedVariantIdx, onSelectVariant }: MetalSelectorProps) => {
  return (
    <div className="space-y-5">
      {options.map((option, oi) => {
        const isMetal = option.name.toLowerCase().includes('metal');

        return (
          <div key={oi}>
            <div className="flex items-center gap-2 mb-3">
              <label className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-body">
                {option.name}
              </label>
              <span className="text-xs font-body text-foreground/60">
                — {variants[selectedVariantIdx]?.node.selectedOptions.find(
                  so => so.name === option.name
                )?.value}
              </span>
            </div>

            {isMetal ? (
              <div className="flex flex-wrap gap-3">
                {option.values.map((value) => {
                  const metalStyle = getMetalStyle(value);
                  const matchedIdx = variants.findIndex(v =>
                    v.node.selectedOptions.some(so => so.name === option.name && so.value === value)
                  );
                  const isSelected = variants[selectedVariantIdx]?.node.selectedOptions.some(
                    so => so.name === option.name && so.value === value
                  );
                  const isAvailable = matchedIdx >= 0 && variants[matchedIdx]?.node.availableForSale;

                  return (
                    <button
                      key={value}
                      onClick={() => matchedIdx >= 0 && onSelectVariant(matchedIdx)}
                      disabled={!isAvailable}
                      className={`group relative flex flex-col items-center gap-1.5 transition-all ${
                        !isAvailable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      title={value}
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${metalStyle?.bg || 'bg-muted'} ring-2 ring-offset-2 ring-offset-background transition-all ${
                          isSelected
                            ? `${metalStyle?.ring || 'ring-foreground'} scale-110`
                            : 'ring-transparent hover:ring-muted-foreground/40'
                        }`}
                      />
                      <span className={`text-[10px] font-body tracking-wider uppercase transition-colors ${
                        isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}>
                        {value.replace(/\d+K\s*/i, '').replace('Gold', '').trim() || value}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const matchedIdx = variants.findIndex(v =>
                    v.node.selectedOptions.some(so => so.name === option.name && so.value === value)
                  );
                  const isSelected = variants[selectedVariantIdx]?.node.selectedOptions.some(
                    so => so.name === option.name && so.value === value
                  );

                  return (
                    <button
                      key={value}
                      onClick={() => matchedIdx >= 0 && onSelectVariant(matchedIdx)}
                      className={`px-4 py-2 text-sm font-body border transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border hover:border-foreground/50'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
