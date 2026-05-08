import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, useInView } from 'framer-motion';
import { Construction } from 'lucide-react';
import CurvedLoop from '../../ui/CurvedLoop/CurvedLoop';
import './Season6.css';

gsap.registerPlugin(ScrollTrigger);

function TerminalLine({ text, delay }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });

  return (
    <motion.p
      ref={ref}
      className="s6-terminal-line"
      initial={{ opacity: 0, x: -15 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {text}
    </motion.p>
  );
}

export default function Season6() {
  const sectionRef  = useRef(null);
  const heroRef     = useRef(null);

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

    tl.fromTo('.s6-tag',
      { opacity: 0, y: -15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
    )
    .fromTo('.s6-construction-icon',
      { opacity: 0, scale: 0, rotate: -20 },
      { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" },
      "-=0.1"
    )
    .fromTo('.s6-title-main',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power4.out" },
      "-=0.3"
    )
    .fromTo('.s6-divider',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
      "-=0.3"
    )
    .fromTo('.s6-subtitle',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.4"
    );
  }, { scope: sectionRef });

  return (
    <section className="s6-section" ref={sectionRef}>
      <div className="s6-hero" ref={heroRef}>

        {/* Curved looping marquee footer element (Moved back to top) */}
        <div className="s6-curve-wrapper">
          <CurvedLoop
            marqueeText="UNDER CONSTRUCTION 🚧 STILL COMPILING ⏳ COMING SOON ✨ "
            speed={1.5}
            curveAmount={120}
            className="s6-curved-text"
          />
        </div>

        {/* Tag */}
        <div className="s6-tag">
          <span className="s6-tag-bracket">[</span>
          <span className="s6-tag-label">S_06</span>
          <span className="s6-tag-bracket">]</span>
        </div>

        {/* Construction icon */}
        <div className="s6-construction-icon">
          <Construction size={42} />
        </div>

        {/* Title — smaller, centered */}
        <h2 className="s6-title-main">
          <span className="s6-title-script">S</span>eason 6
          <span className="s6-title-loading"> — Loading... ⏳</span>
        </h2>

        {/* Divider line */}
        <div className="s6-divider" />

        {/* Subtitle */}
        <p className="s6-subtitle">
          Still under construction. Good things are compiling...
        </p>

      </div>

      {/* Terminal box */}
      <div className="s6-terminal">
        <div className="s6-terminal-header">
          <span className="s6-terminal-dot s6-dot-red" />
          <span className="s6-terminal-dot s6-dot-yellow" />
          <span className="s6-terminal-dot s6-dot-green" />
          <span className="s6-terminal-title">future.exe</span>
        </div>
        <div className="s6-terminal-body">
          <TerminalLine text={<><span className="s6-prompt">Brain:</span> processing... processing...</>} delay={0} />
          <TerminalLine text={<><span className="s6-prompt">Status:</span> Still under construction 🚧</>} delay={0.1} />
          <TerminalLine text={<><span className="s6-prompt">ETA:</span> When it's ready</>} delay={0.2} />
          <TerminalLine text={<><span className="s6-prompt">Tagline:</span> "Good things are compiling..."</>} delay={0.3} />
          <motion.p
            className="s6-cursor"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "steps(1)" }}
          >
            _
          </motion.p>
        </div>
      </div>
    </section>
  );
}
