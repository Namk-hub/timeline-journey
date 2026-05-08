import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, useInView } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import TextPressure from './TextPressure';
import './Season3.css';

gsap.registerPlugin(ScrollTrigger);

const NARRATIVE_LINES = [
  { text: "We had a team, a plan, and for a while it was actually going well — until the backend broke and suddenly I'm staring at errors I couldn't read.", type: "normal" },
  { text: "Wanting to hide but having nothing to offer, and that feeling of watching someone else fight a fire you can't touch? That stays with you.", type: "highlight" },
  { text: "But we pushed through. Fixed it, shipped it, and earned our wildest prize yet: an honorable mention.", type: "normal" },
  { text: "On the way home it hit me that I never want to feel that useless again.", type: "highlight" },
];

function NarrativeLine({ line, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });

  return (
    <motion.p
      ref={ref}
      className={`s3-narrative-line ${line.type === 'highlight' ? 's3-narrative-highlight' : ''}`}
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      animate={isInView
        ? { opacity: 1, y: 0, filter: 'blur(0px)' }
        : { opacity: 0, y: 30, filter: 'blur(6px)' }
      }
      transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
    >
      {line.type === 'highlight' && <span className="s3-narrative-quote">"</span>}
      {line.text}
      {line.type === 'highlight' && <span className="s3-narrative-quote">"</span>}
    </motion.p>
  );
}

export default function Season3() {
  const sectionRef   = useRef(null);
  const heroRef      = useRef(null);
  const narrativeRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top 80%",
        end: "top 20%",
        scrub: false,
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo('.s3-tag',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
    )
    .fromTo('.s3-title-watermark',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
      "-=0.2"
    )
    .fromTo('.s3-title-main',
      { opacity: 0, y: 40, clipPath: "inset(100% 0 0 0)" },
      { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 0.8, ease: "power4.out" },
      "-=0.4"
    )
    .fromTo('.s3-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    // Narrative parallax
    gsap.fromTo(narrativeRef.current,
      { y: 60 },
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: narrativeRef.current,
          start: "top bottom",
          end: "top center",
          scrub: 1,
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section className="s3-section" ref={sectionRef}>

      {/* ═══ HERO: Title LEFT + Spline bulb RIGHT ═══ */}
      <div className="s3-hero" ref={heroRef}>

        {/* LEFT: Editorial title + ERROR glitch */}
        <div className="s3-hero-text">
          <div className="s3-tag">
            <span className="s3-tag-bracket">[</span>
            <span className="s3-tag-label">S_03</span>
            <span className="s3-tag-bracket">]</span>
          </div>

          <div className="s3-title-wrap">
            <span className="s3-title-watermark" aria-hidden="true">SEASON</span>
            <h2 className="s3-title-main">
              <span className="s3-title-script">S</span>eason 3
            </h2>
          </div>

          <p className="s3-subtitle">
            <span className="s3-subtitle-line" />
            Season 3 — My First Hackathon.
          </p>

          {/* Narrative inline beside bulb */}
          <div className="s3-narrative-inline" ref={narrativeRef}>
            <div className="s3-narrative-content">
              {NARRATIVE_LINES.map((line, i) => (
                <NarrativeLine key={i} line={line} index={i} />
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT: TextPressure "My First Hackathon" + Spline bulb */}
        <div className="s3-hero-visual">
          <div className="s3-text-pressure-wrap">
            <TextPressure
              text="My First Hackathon"
              flex={true}
              alpha={false}
              stroke={true}
              width={true}
              weight={true}
              italic={true}
              textColor="#e09f3e"
              strokeColor="#e09f3e"
              minFontSize={28}
            />
          </div>
          <div className="s3-bulb-container">
            <Spline scene="https://prod.spline.design/7j7BoeCGCtG6Nn-w/scene.splinecode" />
          </div>
        </div>
      </div>
    </section>
  );
}
