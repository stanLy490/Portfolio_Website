'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { pageConfigs } from '@/lib/configs/pageConfigs';
import MediaGallery from '@/components/ui/MediaGallery';

export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const config = pageConfigs[slug];

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-white/70 mb-8">Project not found</p>
          <Link
            href="/"
            className="text-white/60 text-xs font-semibold uppercase tracking-[0.1em] px-4 py-2 border border-white/30 bg-black/50 backdrop-blur-sm hover:text-white hover:border-white/80 hover:bg-blue-500/30 transition-all duration-300"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Back button */}
      <Link
        href="/"
        className="fixed top-8 right-10 z-[100] text-white/60 text-[11px] font-semibold uppercase tracking-[0.1em] px-4 py-2 border border-white/30 bg-black/50 backdrop-blur-sm hover:text-white hover:border-white/80 hover:bg-blue-500/30 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(30,111,255,0.4)] transition-all duration-300 opacity-0 animate-[fadeInButton_1s_ease-in-out_0.5s_forwards]"
      >
        ← Back
      </Link>

      {/* Media gallery */}
      <MediaGallery
        items={config.images}
        sidebarStyle={config.sidebarStyle}
      />

      <style jsx>{`
        @keyframes fadeInButton {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
