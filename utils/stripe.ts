"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface StripeSubscription {
  status: string;
  current_period_start: number;
  current_period_end: number;
  created: number;
}

// function to check if the user has a subscription
export async function hasSubscription(): Promise<{
  isSubscribed: boolean;
  subscriptionData: StripeSubscription[];
}> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (user && user.id) {
    const userDB = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userDB?.stripeCustomerId) {
      return { isSubscribed: false, subscriptionData: [] };
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: String(userDB.stripeCustomerId),
    });

    return {
      isSubscribed: subscriptions.data.length > 0,
      subscriptionData: subscriptions.data,
    };
  }

  return { isSubscribed: false, subscriptionData: [] };
}

// function to create a checkout link
export async function createCheckoutLink(customer: string) {
  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      customer: customer,
      line_items: [
        {
          price: "price_1QCewDKFh4VfAhk8Zdykj6UE",
          quantity: 1,
        },
      ],
      mode: "subscription",
    });

    return checkoutSession.url;
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to create checkout link");
  }
}

// function to generate a customer portal link
export async function generateCustomerPortalLink(customerId: string) {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return portalSession.url;
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to generate customer portal link");
  }
}

// function to create a customer if doesn't exist
export async function createCustomerIfNull() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return null;
  }

  const userDB = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!userDB?.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? "",
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
  }

  return userDB?.stripeCustomerId;
}

// function to check if the user is eligible to generate a lesson plan based on their subscription
export async function checkLessonPlanCreationEligibility(): Promise<{
  isEligible: boolean;
  message: string;
  remainingGenerations: number;
}> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return {
      isEligible: false,
      message: "You must be logged in to check your lesson plan eligibility",
      remainingGenerations: 0,
    };
  }

  const userDB = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!userDB) {
    return {
      isEligible: false,
      message: "User not found",
      remainingGenerations: 0,
    };
  }

  const stripeSubscriptionData = await hasSubscription();
  const currentDate = new Date();
  let isSubscribed = false;
  let periodStart: Date;
  let periodEnd: Date;

  if (stripeSubscriptionData.subscriptionData.length > 0) {
    const subscription = stripeSubscriptionData.subscriptionData[0];
    isSubscribed = subscription.status === "active";
    periodStart = new Date(subscription.current_period_start * 1000);
    periodEnd = new Date(subscription.current_period_end * 1000);
  } else {
    periodStart = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    periodEnd = currentDate;
  }

  const generationsCount = await prisma.lessonPlan.count({
    where: {
      userId: user.id,
      createdAt: {
        gte: periodStart,
        lte: periodEnd,
      },
    },
  });

  const limit = isSubscribed ? 20 : 5;
  const remainingGenerations = Math.max(0, limit - generationsCount);

  if (remainingGenerations === 0) {
    const resetDate = isSubscribed
      ? new Date(periodEnd.toLocaleDateString())
      : new Date(
          currentDate.getTime() + 24 * 60 * 60 * 1000
        ).toLocaleDateString();

    return {
      isEligible: false,
      message: isSubscribed
        ? `You have reached the maximum number of generations for this period (${limit}). Next reset date: ${resetDate}`
        : `You have reached the free tier limit (${limit}). You can upgrade to a paid plan to generate more lessons.`,
      remainingGenerations: 0,
    };
  }

  return {
    isEligible: true,
    message: `You have ${remainingGenerations} remaining generations.`,
    remainingGenerations: remainingGenerations,
  };
}
