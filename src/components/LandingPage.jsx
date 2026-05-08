import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './LandingPage.css';

const BOOT_SEGMENTS = 9;

export default function LandingPage() {
  const [bootProgress, setBootProgress] = useState(0);
  const [filledSegments, setFilledSegments] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING_CORE');
  const [uptime, setUptime] = useState(99.9);
  const [latency, setLatency] = useState(12);
  const [threads, setThreads] = useState(1024);
  const [glitching, setGlitching] = useState(false);

  // Boot bar animation
  useEffect(() => {
    let seg = 0;
    const interval = setInterval(() => {
      seg += 1;
      setFilledSegments(seg);
      setBootProgress(Math.round((seg / BOOT_SEGMENTS) * 100));
      if (seg >= BOOT_SEGMENTS) {
        clearInterval(interval);
        setStatusText('SYSTEM_ONLINE');
      }
    }, 350);
    return () => clearInterval(interval);
  }, []);

  // Random glitch on name
  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 120);
    }, 4500);
    return () => clearInterval(glitchTimer);
  }, []);

  // Live-ish latency flicker
  useEffect(() => {
    const flicker = setInterval(() => {
      setLatency(Math.floor(Math.random() * 8) + 9);
    }, 2000);
    return () => clearInterval(flicker);
  }, []);

  return (
    <div className="lp-root">
      {/* Grid overlay */}
      <div className="lp-grid" />

      {/* ── NAVBAR ── */}
      <nav className="lp-nav">
        <div className="lp-nav-left">
          <div className="lp-dots">
            <span className="lp-dot red" />
            <span className="lp-dot yellow" />
            <span className="lp-dot green" />
          </div>
          <span className="lp-nav-brand">
            <span className="lp-nav-accent">terminal</span>
            <span className="lp-nav-version">&nbsp;SYSTEM_VERSION_3.0</span>
          </span>
        </div>
        {/* right side intentionally empty */}
        <div className="lp-nav-right" />
      </nav>

      {/* ── MAIN HERO ── */}
      <main className="lp-hero">
        {/* LEFT */}
        <div className="lp-left">
          <motion.div
            className="lp-connection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="lp-conn-dot" />
            CONNECTION ESTABLISHED
          </motion.div>

          <motion.h1
            className={`lp-title${glitching ? ' glitch' : ''}`}
            data-text="NAMRATA.DEV"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            NAMRATA.DEV
          </motion.h1>

          <motion.div
            className="lp-status-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <span className="lp-chevrons">&gt;&gt;</span>
            <span className="lp-status-label">SYSTEM STATUS:</span>
            <span className="lp-status-badge">{statusText}</span>
          </motion.div>

          <motion.div
            className="lp-loc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            LOC: NORTH_LAT_40.7128 // WEST_LONG_74.0060
          </motion.div>
        </div>

        {/* RIGHT — Boot panel */}
        <motion.div
          className="lp-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="lp-panel-header">
            <span className="lp-panel-title">BOOT_SEQUENCE_ALPHA_CORE</span>
            <span className="lp-panel-pct">{bootProgress}% COMPLETED</span>
          </div>

          {/* Segmented loading bar */}
          <div className="lp-segments">
            {Array.from({ length: BOOT_SEGMENTS }).map((_, i) => (
              <motion.div
                key={i}
                className={`lp-seg${i < filledSegments ? ' lp-seg-filled' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.12 }}
              />
            ))}
          </div>

          <div className="lp-stats">
            <div className="lp-stat">
              <span className="lp-stat-label">LATENCY</span>
              <span className="lp-stat-value">{latency}ms</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-label">THREADS</span>
              <span className="lp-stat-value">{threads.toLocaleString()}</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-label">UPTIME</span>
              <span className="lp-stat-value">{uptime}%</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ── FOOTER STRIP ── */}
      <motion.div
        className="lp-footer-strip"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="lp-footer-left">DEVELOPMENT_CHRONOLOGY</span>
        <span className="lp-footer-right">SEQUENTIAL_INITIALIZATION</span>
      </motion.div>
    </div>
  );
}
