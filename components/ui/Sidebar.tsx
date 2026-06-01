'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SidebarContent } from '@/lib/configs/pageConfigs';

interface SidebarProps {
  content: SidebarContent | null;
  style: {
    width: string;
    background: string;
    backdropBlur: string;
    borderColor: string;
  };
  isVisible: boolean;
}

export default function Sidebar({ content, style, isVisible }: SidebarProps) {
  if (!content) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-0 top-0 h-screen flex flex-col justify-between p-12 z-50"
          style={{
            width: style.width,
            background: style.background,
            backdropFilter: `blur(${style.backdropBlur})`,
            WebkitBackdropFilter: `blur(${style.backdropBlur})`,
            borderLeft: `2px solid ${style.borderColor}`,
          }}
        >
          <div className="flex-1 flex flex-col">
            <div className="text-xs text-white/50 tracking-[0.3em] mb-8 uppercase">
              {content.subtitle}
            </div>

            <div
              className="text-xs leading-relaxed text-white/70"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />

            <div className="text-xs text-white/40 border-t border-white/20 pt-4 mt-8">
              {content.footer}
            </div>
          </div>

          <div className="text-[8vw] font-black uppercase text-white/15 leading-[0.8] text-center mt-auto">
            {content.title}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
