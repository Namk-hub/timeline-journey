import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import SeasonSection from './SeasonSection';
import ConstructionFooter from './ConstructionFooter';
import './Timeline.css';

const SEASONS = [
  {
    id: 1,
    title: "Season 1: Clueless but Curious",
    description: "The beginning of the journey. Staring at the screen, wondering how the internet actually works.",
    align: "left"
  },
  {
    id: 2,
    title: "Season 2: LinkedIn Illusions & Motivation Rush",
    description: "Creating a LinkedIn profile, feeling like a CEO, and watching endless 'Day in the life of a software engineer' videos.",
    align: "right"
  },
  {
    id: 3,
    title: "Season 3: HTML-CSS Survival Era",
    description: "Divs won't center. Everything is broken. But the first colorful button feels like a massive victory.",
    align: "left"
  },
  {
    id: 4,
    title: "Season 4: The Motivation Blackout (Vacation Arc)",
    description: "Burnout hits. Code looks like alien runes. Taking a break to remember what the sun looks like.",
    align: "right"
  },
  {
    id: 5,
    title: "Season 5: Back to Reality – The Backend Awakening",
    description: "Discovering databases, APIs, and the harsh reality that the frontend is just the tip of the iceberg.",
    align: "left"
  },
  {
    id: 6,
    title: "Season 6: Leveling Up – React & Real Building Era",
    description: "Components, state, and hooks. Building actual applications. The current arc.",
    align: "right",
    isCurrent: true
  }
];

export default function Timeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="timeline-container" ref={containerRef}>
      <div className="svg-container">
        <svg 
          viewBox="0 0 100 600" 
          preserveAspectRatio="none" 
          className="snaking-path"
        >
          {/* A curvy snaking path */}
          <motion.path
            d="M 50 0 C 50 50, 10 50, 10 100 C 10 150, 90 150, 90 200 C 90 250, 10 250, 10 300 C 10 350, 90 350, 90 400 C 90 450, 10 450, 10 500 C 10 550, 50 550, 50 600"
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth="2"
            style={{ pathLength: pathLength }}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2f81f7" />
              <stop offset="50%" stopColor="#8957e5" />
              <stop offset="100%" stopColor="#3fb950" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="seasons-wrapper">
        {SEASONS.map((season, index) => (
          <SeasonSection key={season.id} season={season} index={index} />
        ))}
        <ConstructionFooter />
      </div>
    </div>
  );
}
