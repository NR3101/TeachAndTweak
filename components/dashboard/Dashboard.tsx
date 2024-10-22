"use client";

import { LessonPlan } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronRightIcon, Package, Settings } from "lucide-react";

interface DashboardProps {
  lessonPlans: LessonPlan[];
  manageSubscriptionLink: string;
  checkoutLink: string;
  isSubscribed: boolean;
}

const Dashboard = ({
  lessonPlans,
  manageSubscriptionLink,
  checkoutLink,
  isSubscribed,
}: DashboardProps) => {
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [durationFilter, setDurationFilter] = useState<number | null>(null);

  const subjects = Array.from(new Set(lessonPlans.map((plan) => plan.subject)));
  const durations = Array.from(
    new Set(lessonPlans.map((plan) => plan.duration))
  );

  const filteredLessonPlans = lessonPlans.filter((plan) => {
    if (subjectFilter && plan.subject !== subjectFilter) return false;
    if (durationFilter && plan.duration !== durationFilter) return false;
    return true;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-3xl mb-6 font-bold">Your Lesson Plans</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <Select
          onValueChange={(value) =>
            setSubjectFilter(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setDurationFilter(value === "all" ? null : parseInt(value))
          }
        >
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
            <SelectValue placeholder="Filter by duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {durations.map((duration) => (
              <SelectItem key={duration} value={duration.toString()}>
                {duration}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isSubscribed ? (
          <Button asChild variant="default">
            <Link
              href={manageSubscriptionLink}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Manage subscriptions
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            variant="default"
            className="relative overflow-hidden bg-gradient-to-r from-violet-500 via-purple-500
                   to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white dark:text-gray-100 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Link href={checkoutLink} className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Upgrade to pro
            </Link>
          </Button>
        )}
      </div>
      {filteredLessonPlans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredLessonPlans.map((plan) => (
            <Card
              key={plan.id}
              className="overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <Link href={`/plan/${plan.id}`} className="block h-full">
                <CardContent className="p-6 h-48 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex flex-col justify-center items-center text-center transition-colors duration-300">
                  <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-300">
                    {plan.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {plan.subject}
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {plan.duration} minutes
                  </p>
                </CardContent>
                <CardFooter className="p-4 bg-white dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 flex justify-between items-center">
                  <span className="font-medium">
                    Created: {formatDate(new Date(plan.createdAt))}
                  </span>
                  <ChevronRightIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            No lesson plans found
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Create a lesson plan to get started
          </p>
          <Button asChild className="mt-4" variant="default">
            <Link href="/create">Create Lesson Plan</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
