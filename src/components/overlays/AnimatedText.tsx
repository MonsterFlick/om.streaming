"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TextAnimationPreset } from "@/lib/types";

interface AnimatedTextProps {
  text: string;
  preset?: TextAnimationPreset;
  className?: string;
  repeatKey?: string | number;
}

export function AnimatedText({
  text,
  preset = "blur-focus",
  className = "",
  repeatKey,
}: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState("");

  // Handle typewriter mode
  useEffect(() => {
    if (preset !== "typewriter") return;

    let current = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        current += text[i];
        setDisplayedText(current);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [text, preset, repeatKey]);

  if (preset === "typewriter") {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <span>{displayedText}</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2 h-5 bg-amber-400 ml-1 rounded-sm"
        />
      </span>
    );
  }

  if (preset === "blur-focus") {
    const words = text.split(" ");
    return (
      <span className={`inline-block overflow-hidden ${className}`}>
        {words.map((word, idx) => (
          <motion.span
            key={`${repeatKey}-${idx}-${word}`}
            initial={{ opacity: 0, filter: "blur(12px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.55,
              delay: idx * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block mr-[0.25em]"
          >
            {word}
          </motion.span>
        ))}
      </span>
    );
  }

  if (preset === "kinetic") {
    const letters = text.split("");
    return (
      <span className={`inline-block overflow-hidden ${className}`}>
        {letters.map((char, idx) => (
          <motion.span
            key={`${repeatKey}-${idx}-${char}`}
            initial={{ opacity: 0, y: "100%", rotateX: -60 }}
            animate={{ opacity: 1, y: "0%", rotateX: 0 }}
            transition={{
              type: "spring",
              damping: 18,
              stiffness: 140,
              delay: idx * 0.015,
            }}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        ))}
      </span>
    );
  }

  if (preset === "marquee") {
    return (
      <div className={`overflow-hidden whitespace-nowrap w-full ${className}`}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
          className="inline-flex gap-8"
        >
          <span>{text}</span>
          <span>•</span>
          <span>{text}</span>
          <span>•</span>
        </motion.div>
      </div>
    );
  }

  if (preset === "shimmer") {
    return (
      <span
        className={`bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-amber-300 to-zinc-200 bg-[length:200%_auto] animate-[marquee_6s_linear_infinite] ${className}`}
      >
        {text}
      </span>
    );
  }

  return <span className={className}>{text}</span>;
}
