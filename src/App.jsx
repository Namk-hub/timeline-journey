import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import TerminalLoader from './components/TerminalLoader';
import LandingPage from './components/LandingPage';
import Timeline from './components/Timeline';


function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    if (loadingComplete) {
      // Delay heavy Timeline mount slightly to keep LandingPage entrance smooth
      const timer = setTimeout(() => setShowTimeline(true), 400);
      return () => clearTimeout(timer);
    }
  }, [loadingComplete]);

  return (
    <>
      <AnimatePresence mode="wait">
        {!loadingComplete ? (
          <TerminalLoader key="loader" onComplete={() => setLoadingComplete(true)} />
        ) : (
          <div key="main-content">
            <LandingPage />
            {showTimeline && <Timeline />}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
