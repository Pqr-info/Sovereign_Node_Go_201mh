import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  // Generate a grid of nodes
  const nodes = Array.from({ length: 16 });

  return (
    <section style={{ padding: '80px 20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '16px', letterSpacing: '-0.02em' }}>
        The Sentient Substrate
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 60px' }}>
        Welcome to surfgo.net. The NPU-accelerated, autonomous computing organism powering SpaceBook 5D.
      </p>

      {/* CSS Grid for stable node layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        {nodes.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, ease: "easeOut", duration: 0.6 }}
            style={{
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)'
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
