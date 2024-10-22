import AnimatedTitle from "@/components/create/AnimatedTitle";
import LessonPlanForm from "@/components/create/LessonPlanForm";
import {
  checkLessonPlanCreationEligibility,
  hasSubscription,
} from "@/utils/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const CreatePage = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const auth = await isAuthenticated();

  if (!auth) redirect("/");

  const { isSubscribed } = await hasSubscription();
  const { isEligible, message, remainingGenerations } =
    await checkLessonPlanCreationEligibility();

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 
    dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
    >
      <div
        className="max-w-3xl mx-auto bg-white/70 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl 
        shadow-xl p-8 transition-all duration-300 border border-gray-200 dark:border-gray-700"
      >
        <AnimatedTitle title="Create Your" subtitle="Lesson Plan" />
        <LessonPlanForm isSubscribed={isSubscribed} />

        {!isEligible && (
          <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            {message}
          </div>
        )}
        {remainingGenerations > 0 && (
          <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-200 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            {message}
          </div>
        )}
        {isEligible && remainingGenerations === 0 && (
          <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-200 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePage;
