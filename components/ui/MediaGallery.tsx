'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MediaItem, SidebarContent } from '@/lib/configs/pageConfigs';
import Sidebar from '@/components/ui/Sidebar';
import Lightbox from '@/components/ui/Lightbox';

interface MediaGalleryProps {
  items: MediaItem[];
  sidebarStyle: {
    width: string;
    background: string;
    backdropBlur: string;
    borderColor: string;
  };
}

export default function MediaGallery({ items, sidebarStyle }: MediaGalleryProps) {
  const [activeSidebar, setActiveSidebar] = useState<SidebarContent | null>(null);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleMouseEnter = useCallback((item: MediaItem) => {
    setActiveSidebar(item.sidebar);
    setIsSidebarVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsSidebarVisible(false);
    setTimeout(() => setActiveSidebar(null), 600);
  }, []);

  const handleClick = useCallback((item: MediaItem) => {
    if (item.clickable) {
      setLightboxItem(item);
    }
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxItem(null);
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-10 pointer-events-none">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              ease: 'easeOut',
            }}
            className="absolute pointer-events-auto cursor-pointer group"
            style={{
              ...item.position,
              zIndex: item.zIndex,
            }}
            onMouseEnter={() => handleMouseEnter(item)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(item)}
          >
            {item.type === 'video' ? (
              <video
                src={item.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover grayscale brightness-70 contrast-90 border border-white/10 shadow-lg transition-all duration-600 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 group-hover:scale-[1.02] group-hover:shadow-[0_8px_24px_rgba(255,255,255,0.2)]"
              />
            ) : (
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover grayscale brightness-70 contrast-90 border border-white/10 shadow-lg transition-all duration-600 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 group-hover:scale-[1.02] group-hover:shadow-[0_8px_24px_rgba(255,255,255,0.2)]"
              />
            )}
          </motion.div>
        ))}
      </div>

      <Sidebar
        content={activeSidebar}
        style={sidebarStyle}
        isVisible={isSidebarVisible}
      />

      {lightboxItem && (
        <Lightbox
          src={lightboxItem.src}
          type={lightboxItem.type || 'image'}
          alt={lightboxItem.alt}
          isOpen={true}
          onClose={handleCloseLightbox}
        />
      )}
    </>
  );
}
