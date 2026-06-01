'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface LightboxProps {
  src: string;
  type: 'image' | 'video';
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({ src, type, alt, isOpen, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center border border-white/30 bg-black/50 text-white/60 hover:text-white hover:bg-blue-500/30 hover:border-white/80 hover:rotate-90 transition-all duration-300"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {type === 'video' ? (
              <video
                src={src}
                controls
                autoPlay
                loop
                className="max-w-full max-h-[85vh] object-contain border border-white/20 shadow-2xl"
              />
            ) : (
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[85vh] object-contain border border-white/20 shadow-2xl"
              />
            )}

            <div className="text-white/70 text-sm font-mono text-center tracking-wider uppercase">
              {alt}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
