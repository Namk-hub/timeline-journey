import React, { useRef, useEffect, useState, useCallback } from 'react';
import SeasonSection from '../SeasonSection/SeasonSection';
import Season1 from '../../seasons/Season1/Season1';
import Season2 from '../../seasons/Season2/Season2';
import Season3 from '../../seasons/Season3/Season3';
import Season4 from '../../seasons/Season4/Season4';
import Season5 from '../../seasons/Season5/Season5';
import Season6 from '../../seasons/Season6/Season6';
import './Timeline.css';

// ── Wider irregular path (viewBox 600 × 1800) ──
const PATH_D = `
  M 300 0
  C 520 60, 560 150, 480 260
  C 380 400, 80 350, 60 480
  C 40 610, 280 620, 400 700
  C 550 790, 560 880, 420 960
  C 250 1060, 60 1050, 100 1180
  C 140 1310, 500 1280, 520 1380
  C 540 1480, 300 1530, 200 1600
  C 100 1670, 250 1750, 300 1800
`;

const VIEWBOX_W   = 600;
const VIEWBOX_H   = 1800;
const DOT_COUNT   = window.innerWidth < 768 ? 60 : 110; // Fewer dots on mobile
const SVG_COL_W   = 600;

/** Sample N evenly-spaced points along an SVG <path> element. */
function samplePath(pathEl, n) {
  const len = pathEl.getTotalLength();
  return Array.from({ length: n }, (_, i) =>
    pathEl.getPointAtLength((i / (n - 1)) * len)
  );
}

// Season colors mapped by progress (0→1 down the page)
const SEASON_COLORS = [
  { at: 0.00, color: '#00e5cc' },  // S1 cyan
  { at: 0.17, color: '#74009f' },  // S2 purple
  { at: 0.33, color: '#e09f3e' },  // S3 amber
  { at: 0.50, color: '#39d353' },  // S4 green
  { at: 0.67, color: '#2f81f7' },  // S5 blue
  { at: 0.83, color: '#f97316' },  // S6 orange
  { at: 1.00, color: '#f97316' },
];

function getSeasonColor(t) {
  for (let i = 0; i < SEASON_COLORS.length - 1; i++) {
    if (t <= SEASON_COLORS[i + 1].at) return SEASON_COLORS[i].color;
  }
  return SEASON_COLORS[SEASON_COLORS.length - 1].color;
}

// All seasons now have dedicated components
const SEASONS = [];

export default function Timeline() {
  const containerRef    = useRef(null);
  const pathRef         = useRef(null);
  const alienRef        = useRef(null);
  const pathLengthRef   = useRef(0);

  const [dots,        setDots]        = useState([]);
  const [lit,         setLit]         = useState([]);
  const [pathVisible, setPathVisible] = useState(false);
  const [alienPos,    setAlienPos]    = useState({ x: -100, y: -100 });

  // ── 1. Sample dots once the hidden path mounts ────────────────────────────
  useEffect(() => {
    if (pathRef.current) {
      pathLengthRef.current = pathRef.current.getTotalLength();
      const pts = samplePath(pathRef.current, DOT_COUNT);
      setDots(pts);
      setLit(new Array(DOT_COUNT).fill(false));
    }
  }, []);

  // ── 2. Scroll handler ─────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    const path      = pathRef.current;
    if (!container || !path || !pathLengthRef.current) return;

    const rect       = container.getBoundingClientRect();
    const viewH      = window.innerHeight;
    const containerH = container.offsetHeight;
    const scrolledIn = -rect.top;

    const FADE_THRESHOLD = viewH * 0.25;
    const isVisible = scrolledIn >= FADE_THRESHOLD;
    
    // Only update pathVisible if it changed to avoid unnecessary re-renders
    setPathVisible(prev => (prev !== isVisible ? isVisible : prev));

    const totalTravel    = containerH - viewH - FADE_THRESHOLD;
    const adjustedScroll = scrolledIn - FADE_THRESHOLD;
    const progress       = Math.min(1, Math.max(0, adjustedScroll / totalTravel));

    // Update lit dots
    if (dots.length > 0) {
      const litCount = Math.round(progress * DOT_COUNT);
      // Only update if the litCount actually changed to save cycles
      setLit(prev => {
        const currentLitCount = prev.filter(Boolean).length;
        if (currentLitCount === litCount) return prev;
        return Array.from({ length: DOT_COUNT }, (_, i) => i < litCount);
      });
    }

    // Alien position: using cached totalLen
    const pt = path.getPointAtLength(progress * pathLengthRef.current);

    const containerW = container.offsetWidth;
    const scaleX = containerW / VIEWBOX_W;
    const scaleY = containerH / VIEWBOX_H;

    setAlienPos({
      x: pt.x * scaleX,
      y: pt.y * scaleY,
    });
  }, [dots]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', onScroll);
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
          {/* ... (SVG content) */}
          <path ref={pathRef} d={PATH_D} fill="none" stroke="none" />

          <defs>
            <linearGradient id="path-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#00e5cc" />
              <stop offset="18%"  stopColor="#74009f" />
              <stop offset="36%"  stopColor="#e09f3e" />
              <stop offset="54%"  stopColor="#39d353" />
              <stop offset="72%"  stopColor="#2f81f7" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <path
            d={PATH_D}
            fill="none"
            stroke="url(#path-gradient)"
            strokeWidth="1.5"
            strokeDasharray="4 11"
            strokeLinecap="round"
            opacity="0.15"
          />

          {dots.map((pt, i) => {
            const t = i / (dots.length - 1);
            const col = getSeasonColor(t);
            return (
              <g key={i}>
                {lit[i] && (
                  <circle
                    cx={pt.x} cy={pt.y} r="7"
                    fill={`${col}22`}
                    className="dot-halo"
                  />
                )}
                <circle
                  cx={pt.x} cy={pt.y}
                  r={lit[i] ? 2.6 : 1.6}
                  fill={lit[i] ? col : `${col}2d`}
                  style={{
                    filter: (lit[i] && window.innerWidth >= 768)
                      ? `drop-shadow(0 0 3px ${col}) drop-shadow(0 0 9px ${col}a6)`
                      : 'none',
                    transition: 'fill 0.18s ease, filter 0.18s ease',
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* ── Alien follower (Now inside the masked column) ── */}
        <div
          ref={alienRef}
          className="alien-follower"
          style={{
            transform:  `translate3d(${alienPos.x - 24}px, ${alienPos.y - 24}px, 0)`,
            opacity:    pathVisible ? 1 : 0,
            transition: window.innerWidth < 768 
              ? 'transform 0.1s linear, opacity 0.8s ease' 
              : 'transform 0.18s cubic-bezier(0.25,0.1,0.25,1), opacity 0.8s ease',
          }}
        >
          <img src="/alien.png" alt="alien follower" className="alien-img" />
        </div>
      </div>

      {/* ── Season cards ── */}
      <div className="seasons-wrapper">
        <Season1 />
        <Season2 />
        <Season3 />
        <Season4 />
        <Season5 />
        <Season6 />
      </div>
    </div>
  );
}
