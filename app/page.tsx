import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import CTASection from "@/components/homepage/CTASection";
import PricingSection from "@/components/common/PricingSection";

function HomePage() {
  return (
    <>
      <MaxWidthWrapper>
        <HeroSection />
      </MaxWidthWrapper>

      <div className="bg-secondary/50">
        <MaxWidthWrapper>
          <FeaturesSection />
        </MaxWidthWrapper>
      </div>

      <PricingSection />

      <div className="bg-secondary/50">
        <MaxWidthWrapper>
          <CTASection />
        </MaxWidthWrapper>
      </div>
    </>
  );
}

export default HomePage;
