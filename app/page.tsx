'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SVGFlasher from '@/components/ui/SVGFlasher';

const sections = [
  {
    id: 'section-0',
    type: 'index',
  },
  {
    id: 'section-1',
    type: 'project',
    projectId: 'A-92',
    title: 'Visions from the Past',
    link: '/project/visions',
    systemLog: [
      'SYSTEM_LOG::',
      'Render queue initialized.',
      'Trajectory calculated [Spline-04].',
      'Latency compensated: 12ms',
    ],
    coordinates: 'X: 492.392 Y: -102.11',
    dragHint: '← DRAG TO EXPLORE',
  },
  {
    id: 'section-2',
    type: 'project',
    projectId: 'B-12',
    title: 'Dimensional Folding',
    link: '/project/dimensional',
    systemLog: [
      'ANALYSIS::',
      'Spatial curvature detected.',
      'Gravity well stabilizing.',
    ],
    description: 'The geometry is folding upon itself to bridge the gap between sectors.',
    dragHint: 'PULL TO UNFOLD →',
  },
  {
    id: 'section-3',
    type: 'project',
    projectId: 'C-07',
    title: 'Event Horizon',
    link: '/project/horizon',
    status: 'CRITICAL',
    time: 'T-MINUS 00:00:00',
    singularity: 'DETECTED',
    dragHint: '← DRAG INTO VOID',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollY(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Scroll container */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-50 overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Section 0: Index */}
        <section className="relative w-full h-screen snap-start flex items-center justify-center overflow-hidden">
          <SVGFlasher />
        </section>

        {/* Section 1: Visions */}
        <section className="relative w-full h-screen snap-start flex items-center justify-center overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-[3]" />
          
          <motion.div
            initial={{ x: '40%', y: '-50%' }}
            animate={{ x: '-8vw', y: '-50%' }}
            transition={{ duration: 10, ease: 'easeOut' }}
            className="absolute w-[32vw] h-[48vh] bg-white p-[0.5vh_6vw_0.5vh_2.5vw] shadow-2xl z-10 cursor-pointer"
            onClick={() => router.push('/project/visions')}
          >
            <div className="w-full h-full bg-[#0f0f0f] relative overflow-hidden border-[10px] border-[#333] flex items-center justify-center">
              <div className="text-center z-10">
                <p className="text-xs text-gray-500 mb-2 tracking-[0.3em]">PROJECT ID: A-92</p>
                <h2 className="text-2xl font-serif text-white tracking-widest italic">Visions from the Past</h2>
                <div className="mt-4 w-8 h-8 border border-white/30 mx-auto flex items-center justify-center">
                  <span className="block w-1 h-1 bg-white" />
                </div>
              </div>
              <div className="absolute top-2 left-2 text-[10px] text-white/30 font-bold">TL-01</div>
              <div className="absolute bottom-2 right-2 text-[10px] text-white/30 font-bold">BR-09</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 0.1 }}
            className="absolute w-[32vw] h-[48vh] bg-[rgba(80,80,80,1)] backdrop-blur-[4px] border-2 border-white/75 flex flex-col justify-between p-8 z-20"
            style={{ right: '15%', top: '50%', transform: 'translateY(-50%)' }}
          >
            <div className="text-xs leading-relaxed font-light text-gray-300">
              <p className="mb-4">
                SYSTEM_LOG::<br />
                Render queue initialized.<br />
                Trajectory calculated [Spline-04].<br />
                Latency compensated: 12ms
              </p>
              <p>COORDINATES:<br />X: 492.392<br />Y: -102.11</p>
            </div>
          </motion.div>

          <div className="absolute top-1/2 left-12 -translate-y-1/2 text-white/40 text-xs font-semibold tracking-[0.3em] uppercase flex items-center gap-2 animate-pulse">
            <span className="text-base">←</span>
            <span>DRAG TO EXPLORE</span>
          </div>
        </section>

        {/* Section 2: Dimensional Folding */}
        <section className="relative w-full h-screen snap-start flex items-center justify-center overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-[3]" />
          
          <motion.div
            initial={{ x: '-50%', y: '-50%' }}
            animate={{ x: '8vw', y: '-50%' }}
            transition={{ duration: 10, ease: 'easeOut' }}
            className="absolute w-[32vw] h-[48vh] bg-white p-[0.5vh_6vw_0.5vh_2.5vw] shadow-2xl z-10 cursor-pointer"
            style={{ left: '50%', top: '50%' }}
            onClick={() => router.push('/project/dimensional')}
          >
            <div className="w-full h-full bg-[#0f0f0f] relative overflow-hidden border-[10px] border-[#333] flex items-center justify-center">
              <div className="text-center z-10">
                <p className="text-xs text-blue-400 mb-2 tracking-[0.3em]">SECTOR: B-12</p>
                <h2 className="text-2xl font-serif text-white tracking-widest italic">Dimensional Folding</h2>
                <div className="mt-4 w-full h-[1px] bg-blue-500/50" />
              </div>
              <div className="absolute top-2 right-2 text-[10px] text-white/30 font-bold">TR-04</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute w-[40vw] h-[49vh] bg-[rgba(80,80,80,1)] backdrop-blur-[4px] border-2 border-white/75 flex flex-col justify-between p-8 z-20"
            style={{ left: '15%', top: '50%', transform: 'translateY(-50%)', textAlign: 'right' }}
          >
            <div className="text-xs leading-relaxed font-light text-gray-300">
              <p className="mb-4">
                ANALYSIS::<br />
                Spatial curvature detected.<br />
                Gravity well stabilizing.
              </p>
              <p>The geometry is folding upon itself to bridge the gap between sectors.</p>
            </div>
            <div className="text-[8vw] font-black uppercase text-white/15 leading-[0.8] text-center mt-auto">FOLD</div>
          </motion.div>

          <div className="absolute top-[18vh] right-12 text-white/40 text-xs font-semibold tracking-[0.3em] uppercase flex items-center gap-2 animate-pulse">
            <span>PULL TO UNFOLD</span>
            <span className="text-base">→</span>
          </div>
        </section>

        {/* Section 3: Event Horizon */}
        <section className="relative w-full h-screen snap-start flex items-center justify-center overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-[3]" />
          
          <motion.div
            initial={{ x: '-8vw', y: '-50%' }}
            animate={{ x: '-8vw', y: '-50%' }}
            transition={{ duration: 10, ease: 'easeOut' }}
            className="absolute w-[50vw] h-[50vh] bg-white p-[0.5vh_6vw_0.5vh_2.5vw] shadow-2xl z-10 cursor-pointer"
            style={{ right: '10%', top: '65%', transform: 'translate(-50%, -50%)' }}
            onClick={() => router.push('/project/horizon')}
          >
            <div className="w-full h-full bg-[#0f0f0f] relative overflow-hidden border-[10px] border-[#333] flex items-center justify-center">
              <div className="text-center z-10">
                <h2 className="text-3xl font-black text-white tracking-[0.5em] uppercase">Event Horizon</h2>
                <p className="text-[10px] text-gray-500 mt-2 tracking-widest">NO RETURN POINT</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 0.1 }}
            className="absolute w-[70vw] h-[50vh] bg-[rgba(91,91,91,1)] backdrop-blur-[4px] border-2 border-white/75 flex flex-col justify-between p-8 z-20"
            style={{ left: '50%', top: '65%', transform: 'translate(-10%, -10%)', textAlign: 'center' }}
          >
            <div className="flex justify-between w-full px-12 pt-20">
              <div className="text-left text-xs text-gray-400">
                STATUS: CRITICAL<br />
                TIME: T-MINUS 00:00:00
              </div>
              <div className="text-right text-xs text-gray-400">
                SINGULARITY<br />
                DETECTED
              </div>
            </div>
            <div className="text-[8vw] font-black uppercase text-white/15 leading-[0.8] text-center mt-auto">VOID</div>
          </motion.div>

          <div className="absolute top-[65%] left-12 -translate-y-1/2 text-white/40 text-xs font-semibold tracking-[0.3em] uppercase flex items-center gap-2 animate-pulse">
            <span className="text-base">←</span>
            <span>DRAG INTO VOID</span>
          </div>
        </section>
      </div>

      {/* Scroll hint */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-xs z-[60] pointer-events-none animate-bounce">
        SCROLL TO EXPLORE
      </div>

      {/* Solar System link */}
      <Link
        href="/galaxy"
        className="fixed bottom-8 right-10 text-white/60 text-[11px] font-semibold uppercase tracking-[0.1em] px-4 py-2 border border-white/30 bg-black/50 backdrop-blur-sm transition-all duration-300 hover:text-white hover:border-white/80 hover:bg-blue-500/30 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(30,111,255,0.4)] z-[60] opacity-0 animate-[fadeInLink_1.5s_ease-in-out_1s_forwards]"
      >
        Solar System →
      </Link>

      <style jsx>{`
        @keyframes fadeInLink {
          0% {
            opacity: 0;
            transform: translateY(10px);
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
