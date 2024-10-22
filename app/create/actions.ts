"use server";

import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { chatSession } from "@/lib/aiModel";

const lessonPlanSchema = z.object({
  topic: z.string(),
  subtopic: z.string(),
  duration: z.string(),
  studentLevel: z.string(),
  objective: z.string(),
  sections: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
      duration: z.string(),
    })
  ),
});

export async function CreateLessonPlan(formData: FormData) {
  const topic = formData.get("topic");
  const subtopic = formData.get("subtopic");
  const duration = formData.get("duration");
  const studentLevel = formData.get("studentLevel");
  const objective = formData.get("objective");

  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized");
    }

    const userDB = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userDB) {
      throw new Error("User not found");
    }

    const prompt = `Create a detailed, structured lesson plan for "${topic}" as a "${subtopic}" lesson lasting ${duration} minutes. Target audience: ${studentLevel} level students. Main objective: ${objective}.

   Requirements:
    1. Ensure the total duration of all sections equals exactly ${duration} minutes.
    2. Create 5-6 sections, each with a clear title, content, and duration.
    3. Include specific, brief activities and teaching methods in each section.
    4. Align all content closely with the main objective.
    5. Consider the student level in the complexity and approach of activities.

    Respond with this exact JSON structure (no markdown or code blocks):
    {
      "topic": "${topic}",
      "subtopic": "${subtopic}",
      "duration": "${duration}",
      "studentLevel": "${studentLevel}",
      "objective": "${objective}",
      "sections": [
        {
          "title": "Section Title",
          "content": "Brief content and activities",
          "duration": "Duration in minutes (number only)"
        }
      ]
    }`;

    const result = await chatSession.sendMessage(prompt);
    const response = result.response;
    let text = response.text();

    // Remove any markdown code block delimiters and extra whitespace
    text = text
      .replace(/```json\s*/, "")
      .replace(/```\s*$/, "")
      .trim();

    // Attempt to parse the JSON, with error handling
    let lessonPlan;
    try {
      lessonPlan = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse JSON. Raw response:", text);
      throw new Error("Invalid response format from AI model");
    }

    // Validate the response using the schema
    const validatedLessonPlan = lessonPlanSchema.parse(lessonPlan);

    const lessonPlanDB = await prisma.lessonPlan.create({
      data: {
        ...validatedLessonPlan,
        userId: userDB.id,
        title: validatedLessonPlan.topic,
        subject: validatedLessonPlan.subtopic,
        duration: parseInt(validatedLessonPlan.duration, 10),
        sections: {
          create: validatedLessonPlan.sections.map((section) => ({
            ...section,
            duration: parseInt(section.duration, 10),
          })),
        },
      },
    });

    revalidatePath("/dashboard");

    return { success: true, lessonPlanId: lessonPlanDB.id };
  } catch (error) {
    console.error("Error in CreateLessonPlan:", error);
    return {
      success: false,
      error: "An error occurred while creating the lesson plan.",
    };
  }
}
