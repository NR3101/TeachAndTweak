import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HiArrowRight } from "react-icons/hi";

export default function CTASection() {
  return (
    <div className="py-20 text-center">
      <h2 className="text-3xl font-bold mb-6 text-foreground">
        Ready to streamline your lesson planning?
      </h2>
      <p className="text-xl mb-10 max-w-2xl mx-auto text-muted-foreground">
        Join hundreds of educators who have already transformed their lesson
        planning with Teach & Tweak.
      </p>
      <Button size="lg" asChild>
        <Link href="/pricing" className="flex items-center gap-2">
          See our plans
          <HiArrowRight className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
}
