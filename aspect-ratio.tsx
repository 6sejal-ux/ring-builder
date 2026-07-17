import { Diamond, Gem, CircleDot, Check, ChevronRight } from "lucide-react";
import { useRingBuilderStore } from "@/stores/ringBuilderStore";

const STEPS = [
  { num: 1, label: "Choose Your", bold: "Diamond", icon: Gem },
  { num: 2, label: "Choose Your", bold: "Setting", icon: Diamond },
  { num: 3, label: "Complete Your", bold: "Ring", icon: CircleDot },
];

export const StepProgressBar = () => {
  const { currentStep, setStep, selectedSetting, selectedDiamond } = useRingBuilderStore();

  const canNavigate = (idx: number) => {
    if (idx === 0) return true;
    if (idx === 1) return !!selectedDiamond;
    if (idx === 2) return !!selectedDiamond && !!selectedSetting;
    return false;
  };

  return (
    <div className="container mb-6">
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          const isCompleted = (i === 0 && selectedDiamond) || (i === 1 && selectedSetting);
          const navigable = canNavigate(i);
          const filled = isActive || isCompleted;

          return (
            <button
              key={step.num}
              onClick={() => navigable && setStep(i)}
              disabled={!navigable}
              className={`relative flex items-center justify-between gap-3 px-5 py-5 md:px-8 md:py-7 rounded-md transition-all ${
                filled
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground/50 border border-border hover:bg-muted disabled:hover:bg-card"
              } ${navigable ? "cursor-pointer" : "cursor-not-allowed"}`}
            >
              <span className="flex items-center gap-3 md:gap-4 min-w-0">
                {isCompleted && !isActive ? (
                  <Check className="w-7 h-7 md:w-9 md:h-9 flex-shrink-0" strokeWidth={2} />
                ) : (
                  <Icon className="w-7 h-7 md:w-9 md:h-9 flex-shrink-0" strokeWidth={1.5} />
                )}
                <span className="text-left hidden sm:block leading-tight">
                  <span className="block text-[10px] md:text-xs tracking-[0.15em] uppercase font-body opacity-80">
                    {step.label}
                  </span>
                  <span className="block text-lg md:text-2xl font-heading font-medium">
                    {step.bold}
                  </span>
                </span>
                <span className="sm:hidden text-xs font-body font-medium">{step.bold}</span>
              </span>
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 opacity-80" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
