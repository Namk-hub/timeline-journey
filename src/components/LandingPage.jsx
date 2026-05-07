import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Code, BrainCircuit, Bug } from 'lucide-react';
import Particles from './ui/Particles';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-background">
        <div className="landing-particles-wrap">
          <Particles
            particleCount={390}
            particleSpread={7}
            speed={0.28}
            particleColors={['#ffffff', '#ffffff', '#ffffff']}
            moveParticlesOnHover={false}
            particleHoverFactor={1}
            alphaParticles={false}
            particleBaseSize={100}
            sizeRandomness={1}
            cameraDistance={20}
            disableRotation={false}
          />
        </div>
      </div>
      
      <div className="landing-content">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="title-section"
        >
          <h1 className="main-title text-gradient">Namrata.dev</h1>
          <p className="subtitle">
            <span className="typing-effect">"System Status: Still Loading…"</span>
            <span className="cursor animate-blink">_</span>
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="status-panel glass-panel"
        >
          <div className="panel-header">
            <Code size={16} /> Live Diagnostics
          </div>
          <div className="status-items">
            <div className="status-item">
              <div className="status-icon green">
                <BrainCircuit size={18} />
              </div>
              <div className="status-info">
                <span className="status-label">Curiosity</span>
                <span className="status-value green-text">100%</span>
              </div>
            </div>
            
            <div className="status-item">
              <div className="status-icon red">
                <span className="dot red-dot"></span>
              </div>
              <div className="status-info">
                <span className="status-label">Sleep</span>
                <span className="status-value red-text">20%</span>
              </div>
            </div>
            
            <div className="status-item">
              <div className="status-icon blue">
                <Bug size={18} />
              </div>
              <div className="status-info">
                <span className="status-label">Bugs</span>
                <span className="status-value blue-text">Infinite</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="scroll-indicator animate-bounce"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <p>scroll to trace the path</p>
        <ChevronDown size={24} />
      </motion.div>
    </div>
  );
}
