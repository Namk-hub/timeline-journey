import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import TerminalLoader from './components/TerminalLoader';
import LandingPage from './components/LandingPage';
import Timeline from './components/Timeline';

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {!loadingComplete ? (
          <TerminalLoader key="loader" onComplete={() => setLoadingComplete(true)} />
        ) : (
          <div key="main-content">
            <LandingPage />
            <Timeline />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
