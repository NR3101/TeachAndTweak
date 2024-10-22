import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { features } from "@/lib/constants";
import {
  HiOutlineLightningBolt,
  HiOutlineAdjustments,
  HiOutlineClock,
  HiOutlineSparkles,
} from "react-icons/hi";

export default function FeaturesSection() {
  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-center mb-12 text-foreground transition-colors duration-300">
        Why choose Teach & Tweak?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <Card
            key={feature.title}
            className="text-center bg-background border-border transition-colors duration-300"
          >
            <CardHeader>
              <div className="flex justify-center mb-4">
                {getFeatureIcon(index)}
              </div>
              <CardTitle className="text-foreground transition-colors duration-300">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground transition-colors duration-300">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function getFeatureIcon(index: number) {
  const iconClass = "w-12 h-12 text-primary transition-colors duration-300";
  switch (index) {
    case 0:
      return <HiOutlineLightningBolt className={iconClass} />;
    case 1:
      return <HiOutlineAdjustments className={iconClass} />;
    case 2:
      return <HiOutlineClock className={iconClass} />;
    case 3:
      return <HiOutlineSparkles className={iconClass} />;
    default:
      return null;
  }
}
