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
  { text: "THIS was my first hackathon  We had a team, a plan, and everything was going great until the backend broke. My teammate was fighting for his life fixing it, and then 30 minutes before submission the whole website crashed -Full panic mode." },
  { text: "Someone told us to check the previous git commit, and thankfully we had it saved locally. We rolled back, got it running, and submitted just in time.", },
  { text: "The mentor said he liked our idea, but the whole thing made me realize something, I don’t just wanna make the frontend look pretty anymore — I actually wanna understand how everything works.", },
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
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const narrativeRef = useRef(null);

  // Lazy load Spline and heavy UI
  const isInView = useInView(sectionRef, { once: true, margin: "200px" });

  useGSAP(() => {
    if (!isInView) return;
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
  }, { scope: sectionRef, dependencies: [isInView] });

  return (
    <section className="s3-section" ref={sectionRef}>

      {/* ═══ FULL-BG SPLINE — scene shifted right ═══ */}
      <div className="s3-bulb-bg">
        {isInView && (
          <Spline scene="https://prod.spline.design/7j7BoeCGCtG6Nn-w/scene.splinecode" />
        )}
      </div>

      {/* ═══ HERO: Title LEFT + TextPressure RIGHT ═══ */}
      <div className="s3-hero" ref={heroRef}>

        {/* LEFT: Editorial title */}
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

          {/* Narrative */}
          <div className="s3-narrative-inline" ref={narrativeRef}>
            <div className="s3-narrative-content">
              {NARRATIVE_LINES.map((line, i) => (
                <NarrativeLine key={i} line={line} index={i} />
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT: TextPressure */}
        <div className="s3-hero-visual">
          <div className="s3-text-pressure-wrap">
            {isInView && (
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

