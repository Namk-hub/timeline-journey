import React, { useRef, useEffect, useState, useCallback } from 'react';
import SeasonSection from './SeasonSection';
import Season1 from './Season1';
import Season2 from './Season2';
import Season3 from './Season3';
import Season4 from './Season4';
import ConstructionFooter from './ConstructionFooter';
import './Timeline.css';

// ── Winding S-curve path (viewBox 200 × 1800) ──────────────────────────────
const PATH_D = `
  M 100 0
  C 170 120, 170 230, 100 320
  C 30  410, 30  530, 100 640
  C 170 750, 170 870, 100 980
  C 30  1090, 30 1210, 100 1320
  C 170 1430, 170 1560, 100 1660
  C 30  1720, 30  1780, 100 1800
`;

const VIEWBOX_W   = 200;
const VIEWBOX_H   = 1800;
const DOT_COUNT   = 90;       // total dots along the path
const SVG_COL_W   = 180;      // pixel width of the centered SVG column

/** Sample N evenly-spaced points along an SVG <path> element. */
function samplePath(pathEl, n) {
  const len = pathEl.getTotalLength();
  return Array.from({ length: n }, (_, i) =>
    pathEl.getPointAtLength((i / (n - 1)) * len)
  );
}

// Seasons 1–4 have dedicated components — generic cards start at Season 5
const SEASONS = [
  {
    id: 5,
    title: "Season 5: Leveling Up – React & Real Building Era",
    description:
      "Components, state, and hooks. Building actual applications. The current arc.",
    align: "right",
    isCurrent: true,
  },
];

export default function Timeline() {
  const containerRef = useRef(null);
  const pathRef      = useRef(null);   // hidden <path> used for sampling
  const alienRef     = useRef(null);

  const [dots,        setDots]        = useState([]);
  const [lit,         setLit]         = useState([]);
  const [pathVisible, setPathVisible] = useState(false);
  const [alienPos,    setAlienPos]    = useState({ x: -100, y: -100 });

  // ── 1. Sample dots once the hidden path mounts ────────────────────────────
  useEffect(() => {
    if (pathRef.current) {
      const pts = samplePath(pathRef.current, DOT_COUNT);
      setDots(pts);
      setLit(new Array(DOT_COUNT).fill(false));
    }
  }, []);

  // ── 2. Scroll handler ─────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    const path      = pathRef.current;
    if (!container || !path) return;

    const rect       = container.getBoundingClientRect();
    const viewH      = window.innerHeight;
    const containerH = container.offsetHeight;

    // Pixels scrolled into the container (negative rect.top once scrolled past)
    const scrolledIn = -rect.top;

    // ── Trigger: path appears at 1/4 of Season1 (≈ 0.25 × viewport) ────────
    const FADE_THRESHOLD = viewH * 0.25;
    const isVisible = scrolledIn >= FADE_THRESHOLD;
    setPathVisible(isVisible);

    // ── Progress 0→1: starts at FADE_THRESHOLD, ends at bottom of container ─
    //    totalTravel = full scrollable distance AFTER the fade threshold
    const totalTravel    = containerH - viewH - FADE_THRESHOLD;
    const adjustedScroll = scrolledIn - FADE_THRESHOLD;
    const progress       = Math.min(1, Math.max(0, adjustedScroll / totalTravel));

    // ── Light up dots ────────────────────────────────────────────────────────
    if (dots.length > 0) {
      const litCount = Math.round(progress * DOT_COUNT);
      setLit(Array.from({ length: DOT_COUNT }, (_, i) => i < litCount));
    }

    // ── Alien position: SVG viewBox → container-relative px ─────────────────
    const totalLen = path.getTotalLength();
    const pt       = path.getPointAtLength(progress * totalLen);

    // scaleX/Y converts SVG units → rendered pixels
    const scaleX = SVG_COL_W / VIEWBOX_W;
    const scaleY = containerH / VIEWBOX_H;

    // Left edge of the centered SVG column inside the container
    const containerW = container.offsetWidth;
    const svgLeft    = (containerW - SVG_COL_W) / 2;

    // Offset alien 36px to the RIGHT of the path so it floats beside, not on top
    setAlienPos({
      x: svgLeft + pt.x * scaleX + 36,
      y: pt.y * scaleY,
    });
  }, [dots]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // seed on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="timeline-container" ref={containerRef}>

      {/* ── Centered SVG column — absolute, spans full container height ── */}
      <div
        className="tl-svg-col"
        style={{ opacity: pathVisible ? 1 : 0, transition: 'opacity 1s ease' }}
      >
        <svg
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          preserveAspectRatio="none"
          className="tl-svg"
        >
          {/* Hidden sampler — never rendered, only used for getTotalLength */}
          <path ref={pathRef} d={PATH_D} fill="none" stroke="none" />

          {/* Dim base dotted path (always shown once visible) */}
          <path
            d={PATH_D}
            fill="none"
            stroke="rgba(0,229,204,0.09)"
            strokeWidth="1.8"
            strokeDasharray="4 11"
            strokeLinecap="round"
          />

          {/* Dots along the path */}
          {dots.map((pt, i) => (
            <g key={i}>
              {/* Glow halo — only on lit dots */}
              {lit[i] && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="7"
                  fill="rgba(0,229,204,0.13)"
                  className="dot-halo"
                />
              )}
              {/* Core dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={lit[i] ? 2.6 : 1.6}
                fill={lit[i] ? '#00e5cc' : 'rgba(0,229,204,0.17)'}
                style={{
                  filter: lit[i]
                    ? 'drop-shadow(0 0 3px #00e5cc) drop-shadow(0 0 9px rgba(0,229,204,0.65))'
                    : 'none',
                  transition: 'fill 0.18s ease, filter 0.18s ease',
                }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* ── Alien follower ── */}
      <div
        ref={alienRef}
        className="alien-follower"
        style={{
          transform:  `translate(${alienPos.x - 24}px, ${alienPos.y - 24}px)`,
          opacity:    pathVisible ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        <img src="/alien.png" alt="alien follower" className="alien-img" />
      </div>

      {/* ── Season cards ── */}
      <div className="seasons-wrapper">
        <Season1 />
        <Season2 />
        <Season3 />
        <Season4 />
        {SEASONS.map((season, index) => (
          <SeasonSection key={season.id} season={season} index={index + 4} />
        ))}
        <ConstructionFooter />
      </div>
    </div>
  );
}
