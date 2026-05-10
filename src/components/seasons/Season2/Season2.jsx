import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TiltedCard from '../../ui/TiltedCard/TiltedCard';
import './Season2.css';

gsap.registerPlugin(ScrollTrigger);

// Arrow starts at TOP of card 1, curves irregularly to card 2 and card 3
const ARROW_PATH = `
  M 160 10
  C 180 60, 200 100, 240 140
  C 300 200, 380 160, 420 220
  C 460 280, 490 320, 520 300
  C 560 270, 600 350, 660 370
  C 740 400, 800 340, 870 350
`;

// Diamond waypoint positions (at transition points between cards)
const DIAMONDS = [
  { x: 160, y: 10 },    // start — top of card 1
  { x: 420, y: 220 },   // midpoint — near card 2
  { x: 870, y: 350 },   // end — at card 3
];

export default function Season2() {
  const sectionRef = useRef(null);
  const para1Ref = useRef(null);
  const para2Ref = useRef(null);
  const boxRef = useRef(null);
  const arrowPathRef = useRef(null);
  const arrowDotRef = useRef(null);
  const dia1Ref = useRef(null);
  const dia2Ref = useRef(null);
  const dia3Ref = useRef(null);
  const htmlIconRef = useRef(null);
  const cssIconRef = useRef(null);
  const jsIconRef = useRef(null);

  useGSAP(() => {
    const path = arrowPathRef.current;
    const dot = arrowDotRef.current;
    if (!path) return;

    const totalLen = path.getTotalLength();

    // Initial state
    gsap.set(path, {
      strokeDasharray: totalLen,
      strokeDashoffset: totalLen,
    });
    gsap.set(dot, { opacity: 0 });
    
    // ── Master timeline ─────────────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 55%',
        toggleActions: 'play none none reverse',
      },
    });

    // 1. Diamond 1 pops at top of card 1
    tl.fromTo(dia1Ref.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)' }
    )

      // Card 1 appears
      .fromTo(para1Ref.current,
        { opacity: 0, y: 24, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' },
        '-=0.1'
      )
      // HTML Icon appears with Card 1
      .fromTo(htmlIconRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 0.7, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
        '<'
      )

      // Arrow dot appears + path draws to card 2
      .to(dot, { opacity: 1, duration: 0.15 })
      .to(path, {
        strokeDashoffset: totalLen * 0.45,
        duration: 1.0,
        ease: 'power1.inOut',
      }, '<')

      // Diamond 2 pops at card 2
      .fromTo(dia2Ref.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)' },
        '-=0.15'
      )

      // Card 2 appears
      .fromTo(para2Ref.current,
        { opacity: 0, y: 24, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' },
        '-=0.15'
      )
      // CSS Icon appears with Card 2
      .fromTo(cssIconRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 0.7, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
        '<'
      )

      // Arrow continues to card 3
      .to(path, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power1.inOut',
      })

      // Diamond 3 pops at card 3
      .fromTo(dia3Ref.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)' },
        '-=0.3'
      )

      // Tilted log box appears
      .fromTo(boxRef.current,
        { opacity: 0, rotate: -12, scale: 0.85, filter: 'blur(10px)' },
        { opacity: 1, rotate: -4, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'back.out(1.4)' },
        '-=0.25'
      )
      // JS Icon appears with Card 3
      .fromTo(jsIconRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 0.7, scale: 1, duration: 0.6, ease: 'back.out(1.5)' },
        '<'
      );

    // ── Dot follows the path tip every frame ────────────────────────
    const updateDot = () => {
      const currentOffset = gsap.getProperty(path, 'strokeDashoffset');
      const drawn = totalLen - currentOffset;
      const pt = path.getPointAtLength(Math.max(0, Math.min(drawn, totalLen)));
      gsap.set(dot, { cx: pt.x, cy: pt.y });
    };

    gsap.ticker.add(updateDot);
    return () => gsap.ticker.remove(updateDot);
  }, { scope: sectionRef });

  return (
    <section className="s2-section" ref={sectionRef}>

      {/* ─── HEADER ─────────────────────────────────────────────────── */}
      <div className="s2-header s2-header-right">
        <div className="s2-tag s2-tag-right">
          <span className="s2-tag-bracket">[</span>
          <span className="s2-tag-label">S_02</span>
          <span className="s2-tag-bracket">]</span>
        </div>
        <div className="s2-title-wrap s2-title-wrap-right">
          <span className="s2-watermark" aria-hidden="true">SEASON</span>
          <h2 className="s2-title-main s2-title-main-right">
            <span className="s2-title-script">S</span>eason 2
          </h2>
        </div>
        <p className="s2-subtitle s2-subtitle-right">
          <span className="s2-subtitle-line s2-subtitle-line-right" />
          Season 2 — HTML-CSS Survival Era.
        </p>
      </div>

      {/* ─── STAIR-STEP + ARROW OVERLAY ─────────────────────────────── */}
      <div className="s2-staircase">
        
        {/* Flying Tech Icons (Now animated peeking) */}
        <img ref={htmlIconRef} src="/html.png" alt="HTML" className="s2-flying-icon icon-html" />
        <img ref={cssIconRef} src="/css.png" alt="CSS" className="s2-flying-icon icon-css" />
        <img ref={jsIconRef} src="/js.png" alt="JS" className="s2-flying-icon icon-js" />

        {/* ── SVG arrow overlay ── */}

        {/* ── SVG arrow overlay ── */}
        <svg
          className="s2-arrow-svg"
          viewBox="0 0 1000 450"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Glow trail (blurred duplicate) */}
          <path
            d={ARROW_PATH}
            stroke="rgba(116,0,159,0.12)"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            style={{ filter: 'blur(8px)' }}
          />

          {/* Main arrow path */}
          <path
            ref={arrowPathRef}
            d={ARROW_PATH}
            stroke="url(#s2-arrow-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Moving glowing dot */}
          <circle
            ref={arrowDotRef}
            cx="160"
            cy="10"
            r="6"
            fill="#74009f"
            className="s2-arrow-dot"
          />

          {/* ── Diamond waypoints ── */}
          {DIAMONDS.map((d, i) => (
            <rect
              key={i}
              ref={i === 0 ? dia1Ref : i === 1 ? dia2Ref : dia3Ref}
              x={d.x - 7}
              y={d.y - 7}
              width="14"
              height="14"
              rx="2"
              fill="#74009f"
              transform={`rotate(45, ${d.x}, ${d.y})`}
              className="s2-diamond"
              style={{ opacity: 0 }}
            />
          ))}

          <defs>
            <linearGradient id="s2-arrow-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(116,0,159,0.7)" />
              <stop offset="50%" stopColor="rgba(116,0,159,0.4)" />
              <stop offset="100%" stopColor="rgba(116,0,159,0.8)" />
            </linearGradient>
          </defs>
        </svg>

        {/* ── STEP 1: Para (top-left) ── */}
        <div className="s2-step s2-step-1">
          <div ref={para1Ref}>
            <TiltedCard
              imageSrc=""
              containerHeight="auto"
              containerWidth="100%"
              imageHeight="auto"
              imageWidth="100%"
              rotateAmplitude={10}
              scaleOnHover={1.03}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={false}
            >
              <div className="s2-text-block">
                <p>
                  I finally stopped just watching tutorials and opened a code editor - HTML felt weirdly satisfying — you type something, refresh the page, and it actually shows up.
                  Then CSS came along, and suddenly I was spending way too much time trying to make everything look cool But honestly, that was enough to keep me going.
                </p>
                <span className="s2-entry-label">ENTRY_S2_A</span>
              </div>
            </TiltedCard>
          </div>
        </div>

        {/* ── STEP 2: Para (middle) ── */}
        <div className="s2-step s2-step-2">
          <div ref={para2Ref}>
            <TiltedCard
              imageSrc=""
              containerHeight="auto"
              containerWidth="100%"
              imageHeight="auto"
              imageWidth="100%"
              rotateAmplitude={10}
              scaleOnHover={1.03}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={false}
            >
              <div className="s2-text-block">
                <p>
                  I built my first little website Nothing crazy, just some sections, colors, and buttons. But it was responsive and actually worked on mobile
                  After that, I was hooked.
                </p>
                <span className="s2-entry-label">ENTRY_S2_B</span>
              </div>
            </TiltedCard>
          </div>
        </div>

        {/* ── STEP 3: Tilted log box ── */}
        <div className="s2-step s2-step-3">
          <div ref={boxRef}>
            <TiltedCard
              imageSrc=""
              containerHeight="auto"
              containerWidth="100%"
              imageHeight="auto"
              imageWidth="100%"
              rotateAmplitude={15}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={false}
            >
              <div className="s2-log-box" style={{ margin: 0, transform: 'none' }}>
                <div className="s2-box-grid" />
                <div className="s2-box-header">
                  <span className="s2-box-dot" />
                  LOG_ENTRY_V2.0
                </div>
                <p className="s2-box-quote">
                  Started learning JavaScript… and there went my vacation 😭
                </p>
                <div className="s2-box-footer">
                  <span className="s2-box-status">STATUS:</span>
                  <span className="s2-box-status-val">HYPERLINKED</span>
                </div>
                <span className="s2-box-corner-dot" />
              </div>
            </TiltedCard>
          </div>
        </div>

      </div>
    </section>
  );
}
