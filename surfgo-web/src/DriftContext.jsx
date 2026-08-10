import React, { createContext, useContext, useState, useEffect } from 'react';

const DriftContext = createContext();

export const DriftProvider = ({ children }) => {
  const [driftLevel, setDriftLevel] = useState(0.0); // Phi (Φ)
  const [isDriftActive, setIsDriftActive] = useState(false);

  // Simulate drift changing over time
  useEffect(() => {
    const interval = setInterval(() => {
      // Random walk for temporal drift
      setDriftLevel(prev => Math.max(0, prev + (Math.random() - 0.4) * 0.5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsDriftActive(driftLevel > 2.0); // Threshold for critical drift
  }, [driftLevel]);

  return (
    <DriftContext.Provider value={{ driftLevel, isDriftActive }}>
      {children}
    </DriftContext.Provider>
  );
};

export const useDrift = () => useContext(DriftContext);
