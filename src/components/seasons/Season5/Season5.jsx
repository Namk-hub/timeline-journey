import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import CircularText from '../../ui/CircularText/CircularText';
import './Season5.css';

gsap.registerPlugin(ScrollTrigger);

export default function Season5() {
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const tagRef = useRef(null);
  const subtitleRef = useRef(null);

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

    tl.fromTo(tagRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
    )
      .fromTo('.s5-title-watermark',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo('.s5-title-main',
        { opacity: 0, y: 40, clipPath: "inset(100% 0 0 0)" },
        { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 0.8, ease: "power4.out" },
        "-=0.4"
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo('.s5-circular-wrap',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.4"
      );
  }, { scope: sectionRef });

  return (
    <section className="s5-section" ref={sectionRef}>
      <div className="s5-hero" ref={heroRef}>
        <div className="s5-hero-content">
          <div className="s5-tag" ref={tagRef}>
            <span className="s5-tag-bracket">[</span>
            <span className="s5-tag-label">S_05</span>
            <span className="s5-tag-bracket">]</span>
          </div>

          <div className="s5-title-wrap">
            <span className="s5-title-watermark" aria-hidden="true">SEASON</span>
            <h2 className="s5-title-main">
              <span className="s5-title-script">S</span>eason 5
            </h2>
          </div>

          <p className="s5-subtitle" ref={subtitleRef}>
            <span className="s5-subtitle-line" />
            Season 5 — Open Source & Real Building Era.
          </p>

          <motion.div
            className="s5-narrative-note"
            initial={{ opacity: 0, scale: 0.9, rotate: -5, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -1, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.5
            }}
          >
            <p className="s5-handwritten-text">
              Nexus Spring of Code got me into open source and bro I had no idea how big it actually was. Was literally jumping from project to project just to find one issue I could touch — embarrassing but true. Then my first contribution got merged and it just hit different. Also finally got why everyone's always on about Git. Still early days but I'm not stopping.
            </p>
            <div className="s5-note-pin" />
          </motion.div>

          <motion.div
            className="s5-narrative-note s5-note-postscript"
            initial={{ opacity: 0, scale: 0.9, rotate: 5, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 3, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 12,
              delay: 0.8
            }}
          >
            <p className="s5-handwritten-text">
              p.s. I think I'm obsessed.
            </p>
            <div className="s5-note-pin" />
          </motion.div>
        </div>

        <div className="s5-circular-wrap">
          <CircularText
            text="OPEN*SOURCE*BUILDING*"
            onHover="speedUp"
            spinDuration={20}
            className="s5-circular-text"
          />
        </div>
      </div>
    </section>
  );
}
