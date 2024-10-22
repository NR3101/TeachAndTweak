import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { HiArrowRight } from "react-icons/hi";

export default function HeroSection() {
  return (
    <div className="py-20 md:py-28 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl font-fira-code text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 transition-colors duration-300">
        Create Engaging Lesson Plans In Seconds
      </h1>
      <p className="mt-6 text-lg max-w-3xl mx-auto text-muted-foreground transition-colors duration-300">
        Empower your teaching with{" "}
        <span className="font-bold text-primary transition-colors duration-300">
          Teach & Tweak&apos;s
        </span>{" "}
        AI powered lesson plans tailored to your needs. Save time and focus on
        what&apos;s important - Teaching.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
        <Link
          href="/create"
          className={`${buttonVariants({
            variant: "default",
          })} flex items-center gap-2`}
        >
          Get Started For Free
          <HiArrowRight className="h-5 w-5" />
        </Link>
        <Link
          href="/pricing"
          className={buttonVariants({ variant: "outline" })}
        >
          View Pricing
        </Link>
      </div>
    </div>
  );
}
