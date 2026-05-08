import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, useInView } from 'framer-motion';
import TiltedCard from '../../ui/TiltedCard/TiltedCard';
import './Season1.css';

gsap.registerPlugin(ScrollTrigger);

const FLIPBOOK_IMAGES = ['/tech.jpg', '/github.jpg', '/hello-world.jpg', '/code.jpg', '/twitter.jpg'];

const NARRATIVE_LINES = [
  { text: "I didn’t have some perfect roadmap. It all started with one random tech video — Then suddenly I was deep into late-night rabbit holes, opening way too many tabs, and trying to learn everything at once.", type: "normal" },
  { text: "I joined communities on LinkedIn, Reddit, Discord, and Twitter, mostly just observing and learning from developers who were building cool stuff.", type: "normal" },
  { text: "And slowly I realized they weren’t superhuman — they just stayed consistent and kept learning.", type: "normal" },
  { text: "That’s when I had my first real thought — wait… maybe I can do this too.", type: "highlight" },
];

// Flipbook — cycles images every 500ms like a stop-motion video
function Flipbook() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FLIPBOOK_IMAGES.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flipbook-frame">
      {FLIPBOOK_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Season 1 frame ${i + 1}`}
          className={`flipbook-img ${i === currentIndex ? 'active' : ''}`}
        />
      ))}
      <div className="flipbook-scanlines" />
      <div className="flipbook-glow" />
    </div>
  );
}

// Individual narrative line with scroll-triggered reveal
function NarrativeLine({ line, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });

  return (
    <motion.p
      ref={ref}
      className={`narrative-line ${line.type === 'highlight' ? 'narrative-highlight' : ''}`}
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      animate={isInView
        ? { opacity: 1, y: 0, filter: 'blur(0px)' }
        : { opacity: 0, y: 30, filter: 'blur(6px)' }
      }
      transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
    >
      {line.type === 'highlight' && <span className="narrative-quote">"</span>}
      {line.text}
      {line.type === 'highlight' && <span className="narrative-quote">"</span>}
    </motion.p>
  );
}

export default function Season1() {
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const titleWrapRef = useRef(null);
  const subtitleRef = useRef(null);
  const tagRef = useRef(null);
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

    // Staggered entrance
    tl.fromTo(tagRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
    )
      .fromTo('.s1-title-watermark',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo('.s1-title-main',
        { opacity: 0, y: 40, clipPath: "inset(100% 0 0 0)" },
        { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 0.8, ease: "power4.out" },
        "-=0.4"
      )
      .fromTo(subtitleRef.current,
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
    <section className="s1-section" ref={sectionRef}>
      {/* ═══ HERO: Editorial Typography + Flipbook ═══ */}
      <div className="s1-hero" ref={heroRef}>
        <div className="s1-hero-text">
          {/* Tag */}
          <div className="s1-tag" ref={tagRef}>
            <span className="s1-tag-bracket">[</span>
            <span className="s1-tag-label">S_01</span>
            <span className="s1-tag-bracket">]</span>
          </div>

          {/* Layered editorial title */}
          <div className="s1-title-wrap" ref={titleWrapRef}>
            {/* Background watermark text */}
            <span className="s1-title-watermark" aria-hidden="true">
              SEASON
            </span>
            {/* Foreground styled title */}
            <h2 className="s1-title-main">
              <span className="s1-title-script">S</span>eason 1
            </h2>
          </div>

          {/* Subtitle under title */}
          <p className="s1-subtitle" ref={subtitleRef}>
            <span className="s1-subtitle-line" />
            Season 1 - Clueless, curious, and quietly obsessed.
          </p>
        </div>

        <div className="s1-hero-visual">
          <TiltedCard
            imageSrc=""
            altText="Season 1 Flipbook"
            captionText=""
            containerHeight="clamp(260px, 35vw, 400px)"
            containerWidth="100%"
            imageHeight="clamp(260px, 35vw, 400px)"
            imageWidth="100%"
            rotateAmplitude={12}
            scaleOnHover={1.05}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={false}
          >
            <Flipbook />
          </TiltedCard>
        </div>
      </div>

      {/* ═══ NARRATIVE ═══ */}
      <div className="s1-narrative" ref={narrativeRef}>
        <div className="s1-narrative-inner">
          <div className="s1-narrative-divider">
            <span className="s1-divider-line" />
            <span className="s1-divider-icon">{'{ }'}</span>
            <span className="s1-divider-line" />
          </div>

          <div className="s1-narrative-content">
            {NARRATIVE_LINES.map((line, i) => (
              <NarrativeLine key={i} line={line} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
