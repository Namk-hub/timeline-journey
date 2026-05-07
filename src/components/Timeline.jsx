import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SeasonSection from './SeasonSection';
import Season1 from './Season1';
import ConstructionFooter from './ConstructionFooter';
import './Timeline.css';

gsap.registerPlugin(ScrollTrigger);

const SEASONS = [
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
  const pathRef = useRef(null);
  const svgRef = useRef(null);
  const alienRef = useRef(null);
  const alienImgRef = useRef(null);

  useGSAP(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    const alien = alienRef.current;
    const container = containerRef.current;
    const totalLength = path.getTotalLength();

    // 1. Draw the organic path smoothly on scroll
    gsap.set(path, { strokeDasharray: totalLength, strokeDashoffset: totalLength });
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "bottom bottom",
        scrub: 0.5,
      }
    });

    // 2. Alien follows the path — uses ScrollTrigger.create with self.progress
    //    for instant, lag-free positioning (no scrub smoothing delay).
    //    Manually converts SVG viewBox coords → screen coords to handle
    //    the preserveAspectRatio="none" distortion.
    ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "bottom bottom",
      onUpdate: (self) => {
        const point = path.getPointAtLength(self.progress * totalLength);

        // SVG viewBox → rendered pixel conversion
        const svgRect = svg.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scaleX = svgRect.width / 700;   // viewBox width
        const scaleY = svgRect.height / 5200;  // viewBox height

        // Position relative to the container (absolute positioning context)
        const x = (point.x * scaleX) + (svgRect.left - containerRect.left);
        const y = (point.y * scaleY) + (svgRect.top - containerRect.top);

        alien.style.transform = `translate(${x - 24}px, ${y - 24}px)`;
      },
    });

    // 3. Subtle idle floating animation for the alien image
    gsap.to(alienImgRef.current, {
      y: "-=8",
      x: "+=3",
      rotation: 5,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  // Elegant, asymmetrical, organic Bézier curve
  const organicPath = `
  M 350 0
  C 600 200, 100 500, 450 800
  C 620 1100, 80 1400, 300 1800
  C 500 2100, 150 2600, 420 3000
  C 600 3400, 200 3700, 380 4200
`;

  return (
    <div className="timeline-container" ref={containerRef} style={{ position: 'relative' }}>
      <div className="svg-container">
        <svg
          ref={svgRef}
          viewBox="0 0 700 5200"
          preserveAspectRatio="none"
          className="snaking-path"
        >
          {/* Cinematic Organic Path */}
          <path
            ref={pathRef}
            d={organicPath}
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth="0.5"
            pathLength="1"
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

      {/* Alien follower — positioned via manual SVG→screen coord mapping */}
      <div
        ref={alienRef}
        className="alien-follower"
      >
        <img
          ref={alienImgRef}
          src="/alien.png"
          alt="alien follower"
          className="alien-img"
        />
      </div>

      <div className="seasons-wrapper">
        <Season1 />
        {SEASONS.map((season, index) => (
          <SeasonSection key={season.id} season={season} index={index + 1} />
        ))}
        <ConstructionFooter />
      </div>
    </div>
  );
}
