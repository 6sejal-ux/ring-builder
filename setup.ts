import { Link } from "react-router-dom";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { StepProgressBar } from "@/components/ringbuilder/StepProgressBar";
import { SettingStep } from "@/components/ringbuilder/SettingStep";
import { DiamondStep } from "@/components/ringbuilder/DiamondStep";
import { ReviewStep } from "@/components/ringbuilder/ReviewStep";
import { useRingBuilderStore } from "@/stores/ringBuilderStore";

const RingBuilder = () => {
  const currentStep = useRingBuilderStore((s) => s.currentStep);

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      {/* Breadcrumb */}
      <div className="container py-3">
        <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>›</span>
          <span className="text-foreground">Ring Builder</span>
        </div>
      </div>

      <StepProgressBar />

      {currentStep === 0 && <DiamondStep />}
      {currentStep === 1 && <SettingStep />}
      {currentStep === 2 && <ReviewStep />}

      <StoreFooter />
    </div>
  );
};

export default RingBuilder;
