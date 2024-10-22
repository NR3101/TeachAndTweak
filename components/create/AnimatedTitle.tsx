"use client";

import { motion } from "framer-motion";

const AnimatedTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-6xl md:text-7xl transition-colors duration-300">
        {title} <span className="text-indigo-700 dark:text-indigo-400 transition-colors duration-300">{subtitle}</span>
      </h1>
    </motion.div>
  );
};
export default AnimatedTitle;
