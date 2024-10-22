import { tiers } from "@/lib/constants";
import MaxWidthWrapper from "./MaxWidthWrapper";
import PricingCard from "./PricingCard";

const PricingSection = () => {
  return (
    <MaxWidthWrapper>
      <div className="py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground transition-colors duration-300">
          Choose the plan that&apos;s right for you
        </h2>
        <h3 className="text-center text-muted-foreground transition-colors duration-300 mb-8">
          Make sure you are signed in before trying to upgrade to the pro plan.
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier, index) => (
            <PricingCard key={index} tier={tier} index={index} />
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default PricingSection;
