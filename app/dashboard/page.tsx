import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Dashboard from "@/components/dashboard/Dashboard";
import prisma from "@/lib/prisma";
import {
  createCheckoutLink,
  createCustomerIfNull,
  generateCustomerPortalLink,
  hasSubscription,
} from "@/utils/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  await createCustomerIfNull();

  if (!user) redirect("/");

  const userData = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      lessonPlans: true,
      stripeCustomerId: true,
    },
  });

  if (!userData) redirect("/");

  const { isSubscribed } = await hasSubscription();
  const manageSubscriptionLink = await generateCustomerPortalLink(
    "" + userData?.stripeCustomerId
  );
  const checkoutLink = await createCheckoutLink(
    "" + userData?.stripeCustomerId
  );

  return (
    <MaxWidthWrapper className="py-8 md:py-16">
      <Dashboard
        lessonPlans={userData.lessonPlans}
        manageSubscriptionLink={manageSubscriptionLink || ""}
        checkoutLink={checkoutLink || ""}
        isSubscribed={isSubscribed}
      />
    </MaxWidthWrapper>
  );
};
export default DashboardPage;
