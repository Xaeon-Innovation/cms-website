"use client";

import { HTMLMotionProps, motion } from "framer-motion";

interface AnimatedIconProps {
  icon: React.ReactNode;
  animation?: "pulse" | "float" | "spin" | "shake" | "grow" | "none";
  delay?: number;
  className?: string;
}

export function AnimatedIcon({ icon, animation = "float", delay = 0, className = "" }: AnimatedIconProps) {
  
  const getAnimationProps = (): HTMLMotionProps<"div"> => {
    switch(animation) {
      case "pulse":
        return {
          animate: { scale: [1, 1.15, 1] },
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay }
        };
      case "float":
        return {
          animate: { y: [0, -5, 0] },
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay }
        };
      case "spin":
        return {
          animate: { rotate: [0, 360] },
          transition: { duration: 10, repeat: Infinity, ease: "linear" }
        };
      case "shake":
        return {
          animate: { rotate: [0, -15, 15, -15, 15, 0] },
          transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2, delay }
        };
      case "grow":
        return {
          initial: { scale: 0.8, opacity: 0 },
          whileInView: { scale: 1, opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.5, type: "spring", bounce: 0.5, delay }
        }
      default:
        return {};
    }
  };

  return (
    <motion.div className={className} {...getAnimationProps()}>
      {icon}
    </motion.div>
  );
}
