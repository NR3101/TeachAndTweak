"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Clock,
  Target,
  BookmarkIcon,
  Sparkles,
  GraduationCap,
  Loader2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { subtopics, topics, durations, studentLevels } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { containerVariants, itemVariants } from "@/lib/animations";
import { CreateLessonPlan } from "@/app/create/actions";

const LessonPlanForm = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    topic: "",
    subtopic: "",
    duration: "",
    studentLevel: "",
    objective: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const [customTopic, setCustomTopic] = useState<string>("");
  const [customSubtopic, setCustomSubtopic] = useState<string>("");

  // function to handle moving to the next step
  const handleNext = () => {
    if (isStepValid(step)) {
      setStep(step + 1);
    }
  };

  // function to handle moving to the previous step
  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    setStep(step - 1);
  };

  // function to handle changing the input fields when the user selects a topic or subtopic
  const handleInputChange = (field: string, value: string) => {
    if (field === "topic") {
      setCustomTopic("");
      setFormData({
        ...formData,
        topic: value,
        subtopic: "",
      });
    } else if (field === "subtopic") {
      setCustomSubtopic("");
      setFormData({ ...formData, subtopic: value });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  // function to handle changing the custom topic input field
  const handleCustomTopicChange = (value: string) => {
    setCustomTopic(value);
    setFormData({ ...formData, topic: "", subtopic: "" });
    setCustomSubtopic("");
  };

  // function to handle changing the custom subtopic input field
  const handleCustomSubtopicChange = (value: string) => {
    setCustomSubtopic(value);
    setFormData({ ...formData, subtopic: "" });
  };

  // function to clear the topic input field
  const clearTopic = () => {
    setFormData({ ...formData, topic: "", subtopic: "" });
    setCustomSubtopic("");
    setCustomTopic("");
  };

  // function to clear the subtopic input field
  const clearSubtopic = () => {
    setFormData({ ...formData, subtopic: "" });
    setCustomSubtopic("");
  };

  // function to check if the current step is valid based on the user's input
  const isStepValid = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return isSubscribed
          ? customTopic !== "" || formData.topic !== ""
          : formData.topic !== "";
      case 2:
        return isSubscribed
          ? (customTopic !== "" && customSubtopic !== "") ||
              (formData.topic !== "" && formData.subtopic !== "")
          : formData.subtopic !== "";
      case 3:
        return formData.duration !== "";
      case 4:
        return formData.studentLevel !== "";
      case 5:
        return formData.objective !== "";
      default:
        return false;
    }
  };

  // function to check if the form is complete based on the user's input
  const isFormComplete = () => {
    const { topic, subtopic, duration, studentLevel, objective } = formData;
    console.log(formData);

    let result;

    if (isSubscribed) {
      result =
        ((customTopic !== "" && customSubtopic !== "") ||
          (topic !== "" && subtopic !== "")) &&
        duration !== "" &&
        studentLevel !== "" &&
        objective !== "";
    } else {
      result =
        topic !== "" &&
        subtopic !== "" &&
        duration !== "" &&
        studentLevel !== "" &&
        objective !== "";
    }

    return result;
  };

  // useEffect to clear the subtopic input field when the topic input field is changed
  useEffect(() => {
    if (formData.topic && subtopics[formData.topic as keyof typeof subtopics]) {
      setFormData((prev) => ({
        ...prev,
        subtopic: "",
      }));
    }
  }, [formData.topic]);

  // function to render the current step UI based on the step state
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key={"step1"}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <motion.div
              className="flex items-center mb-4"
              variants={itemVariants}
            >
              <BookOpen className="w-6 h-6 mr-2 text-blue-500" />
              <h2 className="text-2xl font-bold">Select Topic</h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              {isSubscribed && (
                <div className="space-y-4 mb-4">
                  <Input
                    placeholder="Enter custom topic"
                    value={customTopic}
                    onChange={(e) => handleCustomTopicChange(e.target.value)}
                    className="w-full dark:bg-gray-700"
                    disabled={formData.topic !== ""}
                  />
                  <p className="text-sm text-gray-500">
                    Or choose from predefined topics
                  </p>
                </div>
              )}
              {
                <div className="flex items-center space-x-2">
                  <Select
                    onValueChange={(value) => handleInputChange("topic", value)}
                    name="topic"
                    value={formData.topic}
                  >
                    <SelectTrigger
                      className="w-full dark:bg-gray-700"
                      disabled={customSubtopic !== ""}
                    >
                      <SelectValue placeholder="Choose a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isSubscribed && formData.topic && (
                    <Button
                      onClick={clearTopic}
                      variant={"outline"}
                      size={"icon"}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              }
            </motion.div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key={"step2"}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <motion.div
              className="flex items-center mb-4"
              variants={itemVariants}
            >
              <BookmarkIcon className="w-6 h-6 mr-2 text-indigo-500" />
              <h2 className="text-2xl font-bold">Select Subtopic</h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              {isSubscribed && customTopic !== "" && (
                <div className="space-y-4 mb-4">
                  <Input
                    placeholder="Enter custom subtopic"
                    value={customSubtopic}
                    onChange={(e) => handleCustomSubtopicChange(e.target.value)}
                    className="w-full dark:bg-gray-700"
                  />
                </div>
              )}
              {(isSubscribed && customTopic === "") || !isSubscribed ? (
                <div className="flex items-center space-x-2">
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("subtopic", value)
                    }
                    value={formData.subtopic}
                    name="subtopic"
                  >
                    <SelectTrigger className="w-full dark:bg-gray-700">
                      <SelectValue placeholder="Choose a subtopic" />
                    </SelectTrigger>
                    <SelectContent>
                      {subtopics[formData.topic as keyof typeof subtopics]?.map(
                        (subtopic) => (
                          <SelectItem key={subtopic} value={subtopic}>
                            {subtopic}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  {isSubscribed && formData.subtopic && (
                    <Button
                      onClick={clearSubtopic}
                      variant="outline"
                      size="icon"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key={"step3"}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <motion.div
              className="flex items-center mb-4"
              variants={itemVariants}
            >
              <Clock className="w-6 h-6 mr-2 text-primary" />
              <h2 className="text-2xl font-bold">Select Duration</h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Select
                name="duration"
                onValueChange={(value) => handleInputChange("duration", value)}
                value={formData.duration}
              >
                <SelectTrigger className="w-full dark:bg-gray-700">
                  <SelectValue placeholder="Choose a duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key={"step4"}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <motion.div
              className="flex items-center mb-4"
              variants={itemVariants}
            >
              <GraduationCap className="w-6 h-6 mr-2 text-blue-500" />
              <h2 className="text-2xl font-bold">Select Student level</h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Select
                name="studentLevel"
                onValueChange={(value) =>
                  handleInputChange("studentLevel", value)
                }
                value={formData.studentLevel}
              >
                <SelectTrigger className="w-full dark:bg-gray-700">
                  <SelectValue placeholder="Choose the students level" />
                </SelectTrigger>
                <SelectContent>
                  {studentLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            key={"step5"}
            initial="hidden"
            animate="visible"
            exit={"exit"}
            variants={containerVariants}
          >
            <motion.div
              className="flex items-center mb-4"
              variants={itemVariants}
            >
              <Target className="w-6 h-6 mr-2 text-purple-500" />
              <h2 className="text-2xl font-bold">Enter lesson objective</h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                placeholder="Enter the lesson objective (max 100 characters)"
                max={100}
                value={formData.objective}
                onChange={(e) => handleInputChange("objective", e.target.value)}
                className="w-full dark:bg-gray-7000"
                name="objective"
              />
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // function to render the loading animation
  const renderLoadingAnimation = () => {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-8 flex flex-col items-center shadow-xl backdrop-blur-md transition-colors duration-300"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            animate={{
              rotate: 360,
              transition: { duration: 2, repeat: Infinity, ease: "linear" },
            }}
          >
            <Loader2 className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <motion.h2
            className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Crafting your lesson plan
          </motion.h2>
          <motion.p
            className="mt-2 text-gray-600 dark:text-gray-300 text-center transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Our AI is working its magic to create the perfect lesson plan for
            you!
          </motion.p>
          <motion.div
            className="mt-6 w-48 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden transition-colors duration-300"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            <motion.div
              className="h-full bg-indigo-600 dark:bg-indigo-400 transition-colors duration-300"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  // function to handle the form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSubmit = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });

    if (isSubscribed) {
      if (customTopic) formDataToSubmit.set("topic", customTopic);
      if (customSubtopic) formDataToSubmit.set("subtopic", customSubtopic);
    }

    console.log("Form Data: ", Object.fromEntries(formDataToSubmit));

    try {
      const response = await CreateLessonPlan(formDataToSubmit);
      if (response.success) {
        router.push("/dashboard");
      } else {
        toast({
          title: "Something went wrong.",
          description:
            "An error occurred. This shouldn't happen. Try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description:
          "An error occurred. This shouldn't happen. Try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors duration-300">
      <form onSubmit={handleSubmit}>
        <div
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 
        via-purple-500 to-pink-500"
        />
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Lesson Planner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full mx-1 ${
                  i <= step
                    ? "bg-indigo-500 dark:bg-indigo-400"
                    : "bg-gray-300 dark:bg-gray-600"
                } transition-colors duration-300`}
              />
            ))}
          </div>
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          <motion.div
            className="mt-6 flex justify-between"
            initial="hidden"
            animate="visible"
          >
            {step > 1 && (
              <motion.div>
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  className="bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 
                  border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 
                  transition-colors duration-300"
                  type="button" // Add this line
                >
                  Previous
                </Button>
              </motion.div>
            )}
            {step < 5 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid(step)}
                className={buttonVariants({
                  variant: "default",
                  className:
                    "ml-auto bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white transition-colors duration-300",
                })}
                type="button"
              >
                Next
              </Button>
            ) : (
              <motion.div className="ml-auto">
                <Button
                  type="submit"
                  className="relative overflow-hidden bg-gradient-to-r from-violet-500 via-purple-500
                   to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white dark:text-gray-100 transition-all duration-300 shadow-md hover:shadow-lg"
                  disabled={!isFormComplete() || isLoading}
                >
                  <span className="absolute inset-0 bg-gradient-to-br from-violet-400/50 via-purple-400/50 to-pink-400/50 dark:from-violet-600/50 dark:via-purple-600/50 dark:to-pink-600/50 rounded-md filter blur-sm" />
                  <span className="relative z-10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 mr-2 text-white/90 dark:text-gray-100/90" />
                    Generate Lesson Plan
                  </span>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
        <AnimatePresence>
          {isLoading && renderLoadingAnimation()}
        </AnimatePresence>
      </form>
    </Card>
  );
};

export default LessonPlanForm;
