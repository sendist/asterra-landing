"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

export function HeroScene({
  introduction,
  sky,
  stars,
  horizon,
  children,
  links,
}: {
  introduction: ReactNode;
  sky: ReactNode;
  stars: ReactNode;
  horizon: ReactNode;
  children: ReactNode;
  links: ReactNode;
}) {
  const scene = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: scene,
    offset: ["start start", "end start"],
  });
  const skyY = useTransform(scrollYProgress, [0, 0.55], ["0%", "-6%"]);
  const descent = useTransform(scrollYProgress, [0, 0.55], ["0%", "-27%"]);
  const approach = useTransform(scrollYProgress, [0, 0.55], [1, 1.32]);
  const twilight = useTransform(scrollYProgress, [0, 0.13, 0.58], [1, 0.98, 0]);
  const linksOpacity = useTransform(scrollYProgress, [0, 0.11], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.28], ["0%", "-50%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.05, 0.26], [1, 1, 0]);

  return (
    <section className="opening" ref={scene} aria-labelledby="site-title">
      <div className="hero">
        <motion.div className="hero-art" aria-hidden="true" style={{ opacity: twilight }}>
          {sky}
          <motion.div className="hero-layer hero-star-layer" style={{ y: skyY }}>{stars}</motion.div>
          <motion.div className="hero-layer horizon" style={{ y: descent, scale: approach }}>{horizon}</motion.div>
        </motion.div>
        <motion.div className="hero-title" style={{ y: titleY, opacity: titleOpacity }}>{children}</motion.div>
      </div>
      <motion.div className="opening-links" style={{ opacity: linksOpacity }}>{links}</motion.div>
      {introduction}
    </section>
  );
}

export function PreviewScene({ children }: { children: ReactNode }) {
  const scene = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scene,
    offset: ["start end", "center center"],
  });
  const outerY = useTransform(scrollYProgress, [0, 1], [54, 0]);
  const innerY = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const cards = Array.isArray(children) ? children : [children];

  return (
    <div className="preview-grid" ref={scene}>
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className="preview-card"
          style={{ y: index === 0 || index === cards.length - 1 ? outerY : innerY }}
        >
          {card}
        </motion.div>
      ))}
    </div>
  );
}
