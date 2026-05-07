import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hyperspeed from './ui/Hyperspeed';
import { hyperspeedPresets } from './ui/HyperSpeedPresets';
import './TerminalLoader.css'; // Let's create a specific CSS for this

const TERMINAL_LINES = [
  "> Initializing Developer...",
  "> Loading Curiosity...",
  "> Starting Backend Engine...",
  "> Launching React Interface..."
];

export default function TerminalLoader({ onComplete }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex < TERMINAL_LINES.length) {
      const line = TERMINAL_LINES[currentLineIndex];
      
      if (currentCharIndex < line.length) {
        const timeout = setTimeout(() => {
          setDisplayedLines(prev => {
            const newLines = [...prev];
            if (newLines[currentLineIndex] === undefined) {
              newLines[currentLineIndex] = '';
            }
            newLines[currentLineIndex] += line[currentCharIndex];
            return newLines;
          });
          setCurrentCharIndex(prev => prev + 1);
        }, Math.random() * 14 + 10); // Faster typing speed
        
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 120); // Faster delay between lines
        return () => clearTimeout(timeout);
      }
    } else {
      // Completed typing all lines
      const timeout = setTimeout(() => {
        onComplete();
      }, 320); // Faster transition to landing
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, onComplete]);

  return (
    <motion.div 
      className="terminal-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.5 }}
    >
      <div className="terminal-hyperspeed-bg">
        <div style={{ width: '1080px', height: '1080px', position: 'relative' }}>
          <Hyperspeed effectOptions={hyperspeedPresets.one} />
        </div>
      </div>

      <div className="terminal-window glass-panel">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="close"></span>
            <span className="minimize"></span>
            <span className="maximize"></span>
          </div>
          <div className="terminal-title">journey &mdash; bash &mdash; 80x24</div>
        </div>
        <div className="terminal-body">
          {displayedLines.map((line, i) => (
            <div key={i} className="terminal-line">
              <span className="prompt">~/dev/me $</span> {line}
            </div>
          ))}
          {currentLineIndex < TERMINAL_LINES.length && (
            <div className="terminal-line">
              <span className="prompt">~/dev/me $</span> 
              <span className="cursor animate-blink">_</span>
            </div>
          )}
          {currentLineIndex >= TERMINAL_LINES.length && (
            <div className="terminal-line text-success">
              <br/>
              ✓ Compiled successfully. Opening journey...
              <span className="cursor animate-blink">_</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
