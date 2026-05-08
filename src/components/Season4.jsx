import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, useInView } from 'framer-motion';
import './Season4.css';

gsap.registerPlugin(ScrollTrigger);

const CAROUSEL_CARDS = [
  { icon: '🗄️', label: 'MongoDB' },
  { icon: '⚡', label: 'Express.js' },
  { icon: '🟢', label: 'Node.js' },
  { icon: '🔑', label: 'Auth & JWT' },
  { icon: '🌐', label: 'REST APIs' },
  { icon: '📡', label: 'Postman' },
  { icon: '🐙', label: 'Git & GitHub' },
  { icon: '🖥️', label: 'Terminal' },
  { icon: '🔒', label: 'bcrypt' },
  { icon: '📦', label: 'npm' },
];

const PROJECT_CARDS = [
  {
    num: '01',
    name: 'Demo Portfolio',
    desc: 'The page that made me think — okay, maybe I can actually do this.',
    link: 'https://namk-hub.github.io/Demo-Portfolio/portfolio.html',
    from: 'right',
  },
  {
    num: '02',
    name: 'StoryBase',
    tag: 'A Blog CRUD App',
    desc: 'First time I built something that actually did something.',
    link: 'https://storybase-sigma.vercel.app/',
    from: 'left',
  },
  {
    num: '03',
    name: 'Scribble.io Clone',
    desc: 'Coming soon — pinky promise.',
    status: 'currently working',
    from: 'right',
  },
];

function ProjectCard({ card }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-15% 0px -15% 0px" });
  const fromRight = card.from === 'right';

  return (
    <motion.div
      ref={ref}
      className={`s4-project-card ${fromRight ? 's4-from-right' : 's4-from-left'}`}
      initial={{ opacity: 0, x: fromRight ? 200 : -200, filter: 'blur(10px)' }}
      animate={isInView
        ? { opacity: 1, x: 0, filter: 'blur(0px)' }
        : { opacity: 0, x: fromRight ? 200 : -200, filter: 'blur(10px)' }
      }
      transition={{ duration: 0.7, delay: 0.05, ease: "easeOut" }}
    >
      <div className="s4-project-inner">
        <div className="s4-project-header">
          <span className="s4-project-num">{card.num}</span>
          {card.status && <span className="s4-project-status">{card.status}</span>}
        </div>
        <h4 className="s4-project-name">{card.name}</h4>
        {card.tag && <span className="s4-project-tag">{card.tag}</span>}
        <p className="s4-project-desc">{card.desc}</p>
        {card.link && (
          <a className="s4-project-link" href={card.link} target="_blank" rel="noopener noreferrer">
            View Project →
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Season4() {
  const sectionRef  = useRef(null);
  const heroRef     = useRef(null);
  const tagRef      = useRef(null);
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
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
    )
    .fromTo('.s4-title-watermark',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
      "-=0.2"
    )
    .fromTo('.s4-title-main',
      { opacity: 0, y: 40, clipPath: "inset(100% 0 0 0)" },
      { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 0.8, ease: "power4.out" },
      "-=0.4"
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );
  }, { scope: sectionRef });

  const cards = [...CAROUSEL_CARDS, ...CAROUSEL_CARDS];

  return (
    <section className="s4-section" ref={sectionRef}>

      {/* ═══ HERO ═══ */}
      <div className="s4-hero" ref={heroRef}>
        <div className="s4-tag s4-tag-right" ref={tagRef}>
          <span className="s4-tag-bracket">[</span>
          <span className="s4-tag-label">S_04</span>
          <span className="s4-tag-bracket">]</span>
        </div>
        <div className="s4-title-wrap s4-title-wrap-right">
          <span className="s4-title-watermark" aria-hidden="true">SEASON</span>
          <h2 className="s4-title-main s4-title-main-right">
            <span className="s4-title-script">S</span>eason 4
          </h2>
        </div>
        <p className="s4-subtitle s4-subtitle-right" ref={subtitleRef}>
          <span className="s4-subtitle-line s4-subtitle-line-right" />
          Season 4 — The Backend Awakening.
        </p>
      </div>

      {/* ═══ CAROUSEL ═══ */}
      <div className="s4-carousel">
        <div className="s4-carousel-track">
          {cards.map((card, i) => (
            <div className="s4-card" key={i}>
              <span className="s4-card-icon">{card.icon}</span>
              <span className="s4-card-label">{card.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="s4-carousel s4-carousel-reverse">
        <div className="s4-carousel-track s4-carousel-track-reverse">
          {cards.map((card, i) => (
            <div className="s4-card" key={`r-${i}`}>
              <span className="s4-card-icon">{card.icon}</span>
              <span className="s4-card-label">{card.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ PROJECTS — scroll-triggered alternating cards ═══ */}
      <div className="s4-projects">
        <h3 className="s4-projects-heading">
          <span className="s4-projects-bracket">{'>'}</span> Worked on the projects:
        </h3>

        <div className="s4-projects-stack">
          {PROJECT_CARDS.map((card, i) => (
            <ProjectCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>

    </section>
  );
}
