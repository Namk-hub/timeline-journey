import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Construction } from 'lucide-react';
import './ConstructionFooter.css';

export default function ConstructionFooter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });

  return (
    <div className="construction-container" ref={ref}>
      
      <motion.div 
        className="construction-content"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <div className="construction-header">
          <Construction size={40} className="warning-icon animate-bounce" />
          <h2 className="season-title">Season 7: Loading... ⏳</h2>
        </div>
        
        <div className="terminal-box">
          <p><span className="prompt">Brain:</span> processing... processing...</p>
          <p><span className="prompt">Status:</span> Still under construction 🚧</p>
          <p><span className="prompt">Tagline:</span> "Good things are compiling..."</p>
          <p className="blinking-cursor">_</p>
        </div>
      </motion.div>
    </div>
  );
}
