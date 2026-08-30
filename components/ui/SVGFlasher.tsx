'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SVG_PATHS = [
  '/svgs/vitruvian_image1.svg',
  '/svgs/vitruvian_image2.svg',
  '/svgs/vitruvian_image3.svg',
  '/svgs/vitruvian_image4.svg',
];

export default function SVGFlasher() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [svgs, setSvgs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSVGs = async () => {
      try {
        const responses = await Promise.all(
          SVG_PATHS.map((path) => fetch(path))
        );
        const texts = await Promise.all(
          responses.map((res) => res.text())
        );
        setSvgs(texts);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load SVGs:', error);
      }
    };

    loadSVGs();
  }, []);

  const switchSVG = useCallback(() => {
    setCurrentIndex((prev) => {
      let next;
      do {
        next = Math.floor(Math.random() * SVG_PATHS.length);
      } while (next === prev && SVG_PATHS.length > 1);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(switchSVG, 900);
    return () => clearInterval(interval);
  }, [isLoaded, switchSVG]);

  if (!isLoaded) {
    return (
      <div className="relative w-[300px] h-[300px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-[300px] h-[300px]" style={{ perspective: '1000px' }}>
      {/* Background gradient */}
      <div
        className="absolute"
        style={{
          top: '700%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '3600px',
          height: '3600px',
          borderRadius: '5000px',
          background: 'radial-gradient(50% 50% at 50% 50%, #FFF 39.42%, #BCBCBC 69.19%, #737373 100%)',
          filter: 'blur(73.55px)',
          zIndex: 2,
        }}
      />

      {/* SVG icons */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0.05 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 z-10"
          style={{
            filter: 'invert(0) brightness(10) drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))',
          }}
          dangerouslySetInnerHTML={{ __html: svgs[currentIndex] }}
        />
      </AnimatePresence>

      {/* Rotating circles */}
      <svg
        className="absolute inset-0 w-full h-full z-5 pointer-events-none"
        width="350"
        height="350"
        viewBox="0 0 300 300"
        style={{ animation: 'spin-y 2s linear infinite' }}
      >
        <circle cx="150" cy="165" r="135" fill="none" stroke="white" strokeWidth="1" />
      </svg>

      <svg
        className="absolute inset-0 w-full h-full z-5 pointer-events-none"
        width="350"
        height="350"
        viewBox="0 0 300 300"
        style={{ animation: 'spin-y 5s linear infinite' }}
      >
        <circle cx="150" cy="165" r="135" fill="none" stroke="white" strokeWidth="1" />
      </svg>

      {/* Rotating square */}
      <svg
        className="absolute inset-0 w-full h-full z-5 pointer-events-none"
        width="350"
        height="350"
        viewBox="0 0 300 300"
        style={{ animation: 'spin-y-reverse 4s linear infinite' }}
      >
        <rect x="30" y="30" width="270" height="270" fill="none" stroke="white" strokeWidth="1" />
      </svg>

      <style jsx>{`
        @keyframes spin-y {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        @keyframes spin-y-reverse {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(-360deg); }
        }
      `}</style>
    </div>
  );
}
