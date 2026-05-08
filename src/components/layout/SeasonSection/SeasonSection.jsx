import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './SeasonSection.css';

export default function SeasonSection({ season, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-20% 0px -20% 0px" });

  const isLeft = season.align === 'left';

  return (
    <div className="season-container" ref={ref}>

      <div className="season-content-wrapper">
        <motion.div 
          className={`season-card glass-panel ${isLeft ? 'align-left' : 'align-right'}`}
          initial={{ opacity: 0, x: isLeft ? -50 : 50, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : { opacity: 0, x: isLeft ? -50 : 50, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="card-header">
            <span className="season-badge">{season.isCurrent ? 'Current Era' : `Archive ${index + 1}`}</span>
          </div>
          <h2 className="season-title">{season.title}</h2>
          <p className="season-desc">{season.description}</p>
          
          {season.isCurrent && (
            <div className="current-stats">
              <div className="stat-line">
                <span className="stat-label">Skills</span>
                <span className="stat-value animate-blink">loading...</span>
              </div>
              <div className="stat-line">
                <span className="stat-label">Confidence</span>
                <span className="stat-value green-text">60%</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
