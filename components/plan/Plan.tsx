"use client";

import { Layout } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import Classic from "../designs/Classic";
import Modern from "../designs/Modern";
import Minimal from "../designs/Minimal";
import { AnimatePresence, motion } from "framer-motion";
import { LessonPlan, Section } from "@prisma/client";

const designs = [
  {
    id: 0,
    name: "Classic",
    component: Classic,
  },
  {
    id: 1,
    name: "Modern",
    component: Modern,
  },
  {
    id: 2,
    name: "Minimal",
    component: Minimal,
  },
];

type LessonPlanWithSections = LessonPlan & { sections: Section[] };

const Plan = ({ lessonPlan }: { lessonPlan: LessonPlanWithSections }) => {
  const [activeDesign, setActiveDesign] = useState<number>(0);
  const [isDesignSwitcherOpen, setIsDesignSwitcherOpen] =
    useState<boolean>(false);

  const ActiveDesign = designs[activeDesign].component;

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm hover:bg-background/90"
        onClick={() => setIsDesignSwitcherOpen(!isDesignSwitcherOpen)}
      >
        <Layout className="size-4" />
      </Button>

      <AnimatePresence>
        {isDesignSwitcherOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-64 bg-background/95 backdrop-blur-sm shadow-lg z-40 p-4 border-l border-border"
          >
            <h3 className="text-lg font-semibold mb-4 text-foreground">Choose a design</h3>
            <div className="space-y-2">
              {designs.map((design) => (
                <Button
                  key={design.id}
                  variant={activeDesign === design.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveDesign(design.id);
                    setIsDesignSwitcherOpen(false);
                  }}
                >
                  {design.name}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="p-4">
        <ActiveDesign lessonPlan={lessonPlan} />
      </div>
    </div>
  );
};
export default Plan;
