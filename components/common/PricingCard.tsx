import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { CheckIcon } from "lucide-react";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { hasSubscription } from "@/utils/stripe";

type PricingCardProps = {
  tier: {
    name: string;
    price: string;
    features: string[];
  };
  index: number;
};

const PricingCard = async ({ tier, index }: PricingCardProps) => {
  const { isAuthenticated } = getKindeServerSession();
  const auth = await isAuthenticated();
  const { isSubscribed } = await hasSubscription();

  return (
    <Card
      className={`${
        index === 1 ? "border-primary" : ""
      } transition-colors duration-300`}
    >
      <CardHeader>
        <CardTitle className="text-2xl text-foreground transition-colors duration-300">
          {tier.name}
        </CardTitle>
        <CardDescription className="text-3xl font-bold text-foreground transition-colors duration-300">
          {tier.price}
          <span className="text-base font-normal text-muted-foreground transition-colors duration-300">
            /month
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2">
          {tier.features.map((feature, findex) => (
            <li
              key={findex}
              className="flex items-center gap-2 text-muted-foreground transition-colors duration-300"
            >
              <CheckIcon className="h-5 w-5 text-primary transition-colors duration-300 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex justify-center">
        {!auth ? (
          <Button asChild className="w-full transition-colors duration-300">
            <LoginLink>Sign up or Login</LoginLink>
          </Button>
        ) : isSubscribed && index === 1 ? (
          <Button
            variant="outline"
            className="w-full cursor-not-allowed transition-colors duration-300"
            disabled
          >
            Current plan
          </Button>
        ) : index === 0 ? (
          <Button
            asChild
            variant="outline"
            className="w-full transition-colors duration-300"
          >
            <Link href="/create">Get started</Link>
          </Button>
        ) : (
          <Button
            asChild
            variant="default"
            className="w-full transition-colors duration-300"
          >
            <Link href="/dashboard">Upgrade to pro</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
