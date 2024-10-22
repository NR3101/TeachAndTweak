import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Plan from "@/components/plan/Plan";
import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LessonPlan, Section } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

type LessonPlanWithSections = LessonPlan & { sections: Section[] };

const PlanPage = async ({ params }: { params: { id: string } }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) redirect("/");

  const lessonPlan = await prisma.lessonPlan.findUnique({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      sections: true,
    },
  });

  if (!lessonPlan) return notFound();

  return (
    <MaxWidthWrapper>
      <Plan lessonPlan={lessonPlan as LessonPlanWithSections} />
    </MaxWidthWrapper>
  );
};
export default PlanPage;
