'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PlanetInfo {
  name: string;
  description: string[];
  redirectUrl: string;
}

interface Asteroid {
  x: number;
  y: number;
  radius: number;
  speed: number;
  id: string;
  isLarge: boolean;
  color: string;
  trail: { x: number; y: number }[];
  discoveredId: string | null;
}

interface TrackedSlot {
  targetId: string | null;
  displayX: number;
  displayY: number;
  displayWidth: number;
  displayHeight: number;
  isActive: boolean;
}

interface TextPosition {
  current: number;
  target: number;
  stableFrames: number;
}

const planetInfos: PlanetInfo[] = [
  { name: 'Mercury', description: ['Closest to the Sun', 'Surface: 430°C'], redirectUrl: '/meteorite' },
  { name: 'Venus', description: ['Morning star', 'Toxic atmosphere'], redirectUrl: '/meteorite' },
  { name: 'Earth', description: ['Our home', 'Life exists here'], redirectUrl: '/meteorite' },
  { name: 'Mars', description: ['Red planet', 'Olympus Mons'], redirectUrl: '/meteorite' },
  { name: 'Jupiter', description: ['Gas giant', 'Great Red Spot'], redirectUrl: '/meteorite' },
  { name: 'Saturn', description: ['Ringed planet', 'Titan moon'], redirectUrl: '/meteorite' },
  { name: 'Uranus', description: ['Ice giant', 'Tilted axis'], redirectUrl: '/meteorite' },
  { name: 'Neptune', description: ['Farthest planet', 'Strong winds'], redirectUrl: '/meteorite' },
];

const MAX_TRACKED = 5;
const TRACKING_SMOOTH_FACTOR = 0.12;
const NORMAL_SPEED = 1.2;
const SLOW_SPEED = 0.2;
const MAX_SPEED_ASTEROID_DISTANCE = 35;
const STABLE_THRESHOLD = 60;

export default function GalaxyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const animFrameRef = useRef<number>(0);
  
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const speedFactorRef = useRef(NORMAL_SPEED);
  const detectedAsteroidRef = useRef<Asteroid | null>(null);
  const discoveredIdCounterRef = useRef(1);
  
  const asteroidsRef = useRef<Asteroid[]>([]);
  const largeAsteroidsRef = useRef<Asteroid[]>([]);
  const normalAsteroidsRef = useRef<Asteroid[]>([]);
  const trackedSlotsRef = useRef<TrackedSlot[]>([]);
  const trackedPlanetInfoRef = useRef<Map<string, PlanetInfo>>(new Map());
  const textPositionsRef = useRef<Map<string, TextPosition>>(new Map());
  const availableInfoIndicesRef = useRef<number[]>([]);

  const generateDiscoveredId = useCallback(() => {
    return `AST-${String(discoveredIdCounterRef.current++).padStart(4, '0')}`;
  }, []);

  const getNextPlanetInfo = useCallback(() => {
    if (availableInfoIndicesRef.current.length === 0) {
      availableInfoIndicesRef.current = planetInfos.map((_, i) => i);
    }
    const randomIndex = Math.floor(Math.random() * availableInfoIndicesRef.current.length);
    const infoIndex = availableInfoIndicesRef.current[randomIndex];
    availableInfoIndicesRef.current.splice(randomIndex, 1);
    return planetInfos[infoIndex];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const planetConfig = {
      centerX: w * 0.15,
      centerY: h * 0.5,
      radius: w * 0.5,
    };

    const textureDots: { x: number; y: number; opacity: number; size: number }[] = [];
    for (let i = 0; i < 500; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * planetConfig.radius;
      textureDots.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: Math.random() * 0.6 + 0.05,
        size: Math.random() * 10 + 2,
      });
    }

    const planetDots: { x: number; y: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * planetConfig.radius;
      planetDots.push({
        x: planetConfig.centerX + Math.cos(angle) * distance,
        y: planetConfig.centerY + Math.sin(angle) * distance,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    const initAsteroids = () => {
      const asteroids: Asteroid[] = [];
      const largeAsteroids: Asteroid[] = [];
      const normalAsteroids: Asteroid[] = [];

      for (let i = 0; i < 80; i++) {
        const radius = Math.random() * 15 + 1;
        const asteroid: Asteroid = {
          x: Math.random() * w * 2 - w,
          y: 0.25 * h + Math.random() * h * 0.3,
          radius,
          speed: (radius / 15) * 3 + 1,
          id: crypto.randomUUID().slice(0, 8),
          isLarge: radius > 10,
          color: radius > 10
            ? `rgba(200, 200, 200, ${radius / 15})`
            : `rgba(255, 255, 255, ${radius / 10})`,
          trail: [],
          discoveredId: null,
        };

        asteroids.push(asteroid);
        if (asteroid.isLarge) {
          largeAsteroids.push(asteroid);
        } else {
          normalAsteroids.push(asteroid);
        }
      }

      asteroidsRef.current = asteroids;
      largeAsteroidsRef.current = largeAsteroids;
      normalAsteroidsRef.current = normalAsteroids;
    };

    const initTrackingSlots = () => {
      trackedSlotsRef.current = [];
      for (let i = 0; i < MAX_TRACKED; i++) {
        trackedSlotsRef.current.push({
          targetId: null,
          displayX: -100,
          displayY: -100,
          displayWidth: 20,
          displayHeight: 20,
          isActive: false,
        });
      }
    };

    initAsteroids();
    initTrackingSlots();
    availableInfoIndicesRef.current = planetInfos.map((_, i) => i);

    const trackedTargetX = 0.5 * w;
    const trackedTargetY = 0.8 * h;

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      planetConfig.centerX = w * 0.15;
      planetConfig.centerY = h * 0.5;
      planetConfig.radius = w * 0.5;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX;
      mouseYRef.current = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      for (const asteroid of largeAsteroidsRef.current) {
        const distance = Math.sqrt(
          Math.pow(clickX - asteroid.x, 2) + Math.pow(clickY - asteroid.y, 2)
        );

        if (distance <= asteroid.radius) {
          let planetInfo = trackedPlanetInfoRef.current.get('mouse_' + asteroid.id);
          if (!planetInfo) {
            if (!asteroid.discoveredId) {
              asteroid.discoveredId = generateDiscoveredId();
            }
            planetInfo = getNextPlanetInfo();
            trackedPlanetInfoRef.current.set('mouse_' + asteroid.id, planetInfo);
          }
          router.push(planetInfo.redirectUrl);
          return;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    const drawBackgroundPlanet = () => {
      const gradient = ctx.createRadialGradient(
        planetConfig.centerX, planetConfig.centerY, 0,
        planetConfig.centerX, planetConfig.centerY, planetConfig.radius
      );
      gradient.addColorStop(0, 'rgba(47, 47, 47, 0.6)');
      gradient.addColorStop(0.35, 'rgba(69, 69, 69, 0.4)');
      gradient.addColorStop(0.5, 'rgba(66, 66, 66, 0.3)');
      gradient.addColorStop(1, 'rgba(139, 139, 139, 0.1)');

      ctx.beginPath();
      ctx.arc(planetConfig.centerX, planetConfig.centerY, planetConfig.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      textureDots.forEach(dot => {
        const x = planetConfig.centerX + dot.x;
        const y = planetConfig.centerY + dot.y;
        ctx.fillStyle = `rgba(80, 80, 90, ${dot.opacity})`;
        ctx.fillRect(x, y, dot.size, dot.size);
      });

      planetDots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140, 140, 150, ${dot.opacity})`;
        ctx.fill();
      });

      const glowGradient = ctx.createRadialGradient(
        planetConfig.centerX, planetConfig.centerY, planetConfig.radius * 0.92,
        planetConfig.centerX, planetConfig.centerY, planetConfig.radius * 1.08
      );
      glowGradient.addColorStop(0, 'rgba(200, 200, 210, 0.05)');
      glowGradient.addColorStop(0.5, 'rgba(200, 200, 210, 0.2)');
      glowGradient.addColorStop(1, 'rgba(200, 200, 210, 0)');

      ctx.beginPath();
      ctx.arc(planetConfig.centerX, planetConfig.centerY, planetConfig.radius * 1.05, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();
    };

    const drawAsteroid = (asteroid: Asteroid) => {
      if (!asteroid.isLarge && asteroid.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(asteroid.trail[0].x, asteroid.trail[0].y);
        for (let i = 1; i < asteroid.trail.length; i++) {
          ctx.lineTo(asteroid.trail[i].x, asteroid.trail[i].y);
        }
        const gradient = ctx.createLinearGradient(
          asteroid.trail[0].x, asteroid.trail[0].y,
          asteroid.x, asteroid.y
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.5 + asteroid.radius * 0.2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
      ctx.fillStyle = asteroid.color;
      ctx.fill();
    };

    const calculateBounds = (id: string, ratio: number) => {
      const asteroid = largeAsteroidsRef.current.find(a => a.id === id);
      if (!asteroid) return null;

      const planetInfo = trackedPlanetInfoRef.current.get(id);
      if (!planetInfo) return null;

      const centerX = asteroid.x;
      const centerY = asteroid.y;
      const textX = centerX + (trackedTargetX - centerX) * ratio + 15;
      const textY = centerY + (trackedTargetY - centerY) * ratio;
      const numLines = planetInfo.description.length;
      const textHeight = 25 + numLines * 15;
      const textWidth = 250;

      return { x: textX, y: textY - 10, width: textWidth, height: textHeight };
    };

    const checkCollision = (bound1: { x: number; y: number; width: number; height: number } | null, bound2: { x: number; y: number; width: number; height: number } | null) => {
      if (!bound1 || !bound2) return false;
      return !(
        bound1.x + bound1.width < bound2.x ||
        bound1.x > bound2.x + bound2.width ||
        bound1.y + bound1.height < bound2.y ||
        bound1.y > bound2.y + bound2.height
      );
    };

    const wouldCollide = (testId: string, testRatio: number) => {
      const testBound = calculateBounds(testId, testRatio);
      if (!testBound) return false;

      for (const slot of trackedSlotsRef.current) {
        const otherId = slot.targetId;
        if (!otherId || otherId === testId) continue;

        const otherPosition = textPositionsRef.current.get(otherId);
        if (!otherPosition) continue;

        const otherBound = calculateBounds(otherId, otherPosition.current);
        if (checkCollision(testBound, otherBound)) {
          return true;
        }
      }
      return false;
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      drawBackgroundPlanet();

      const mouseX = mouseXRef.current;
      const mouseY = mouseYRef.current;

      let distanceToAnyLargeAsteroid = Infinity;
      for (const asteroid of largeAsteroidsRef.current) {
        const distance = Math.sqrt(
          Math.pow(mouseX - asteroid.x, 2) + Math.pow(mouseY - asteroid.y, 2)
        );
        distanceToAnyLargeAsteroid = Math.min(distanceToAnyLargeAsteroid, distance);
      }

      let targetSpeedFactor = NORMAL_SPEED;
      if (distanceToAnyLargeAsteroid < MAX_SPEED_ASTEROID_DISTANCE) {
        targetSpeedFactor = SLOW_SPEED;
      }
      speedFactorRef.current += (targetSpeedFactor - speedFactorRef.current) * 0.2;

      trackedSlotsRef.current.forEach(slot => {
        if (slot.isActive && slot.targetId) {
          const asteroid = largeAsteroidsRef.current.find(a => a.id === slot.targetId);
          const shouldDeactivate = !asteroid || asteroid.x > w - 150;
          if (shouldDeactivate) {
            slot.isActive = false;
            trackedPlanetInfoRef.current.delete(slot.targetId!);
            textPositionsRef.current.delete(slot.targetId!);
            slot.targetId = null;
          }
        }
      });

      const currentIds = trackedSlotsRef.current.filter(s => s.isActive).map(s => s.targetId);
      const candidates = largeAsteroidsRef.current.filter(a =>
        !currentIds.includes(a.id) && a.x < 100
      );
      candidates.sort((a, b) => a.x - b.x);

      let candidateIndex = 0;
      let assignedThisFrame = false;

      for (const slot of trackedSlotsRef.current) {
        if (!slot.isActive && candidateIndex < candidates.length && !assignedThisFrame) {
          const newAsteroid = candidates[candidateIndex];
          candidateIndex++;

          slot.targetId = newAsteroid.id;
          slot.isActive = true;
          assignedThisFrame = true;

          const isNeverUsed = slot.displayX === -100 && slot.displayY === -100;
          if (isNeverUsed) {
            slot.displayX = newAsteroid.x;
            slot.displayY = newAsteroid.y;
            slot.displayWidth = newAsteroid.radius * 2;
            slot.displayHeight = newAsteroid.radius * 2;
          }

          const planetInfo = getNextPlanetInfo();
          trackedPlanetInfoRef.current.set(newAsteroid.id, planetInfo);
          textPositionsRef.current.set(newAsteroid.id, {
            current: 0.5,
            target: 0.5,
            stableFrames: STABLE_THRESHOLD,
          });
        }
      }

      trackedSlotsRef.current.forEach(slot => {
        if (slot.isActive && slot.targetId) {
          const asteroid = largeAsteroidsRef.current.find(a => a.id === slot.targetId);
          if (asteroid) {
            // 根据速度因子调整追踪平滑系数：速度越快，追踪越灵敏
            const dynamicSmoothFactor = TRACKING_SMOOTH_FACTOR * (1 + (NORMAL_SPEED - speedFactorRef.current) * 2);
            slot.displayX += (asteroid.x - slot.displayX) * dynamicSmoothFactor;
            slot.displayY += (asteroid.y - slot.displayY) * dynamicSmoothFactor;
            slot.displayWidth += (asteroid.radius * 2 - slot.displayWidth) * dynamicSmoothFactor;
            slot.displayHeight += (asteroid.radius * 2 - slot.displayHeight) * dynamicSmoothFactor;
          }
        }
      });

      const candidatePositions = [0.5, 0.33, 0.67, 0.25, 0.75, 0.2, 0.8];

      trackedSlotsRef.current.forEach(slot => {
        const id = slot.targetId;
        if (!id) return;
        const position = textPositionsRef.current.get(id);
        if (!position) return;

        if (!wouldCollide(id, position.target)) {
          position.stableFrames++;
        } else {
          let bestPosition = position.target;
          for (const candidate of candidatePositions) {
            if (!wouldCollide(id, candidate)) {
              bestPosition = candidate;
              break;
            }
          }
          if (Math.abs(bestPosition - position.target) > 0.01) {
            position.target = bestPosition;
            position.stableFrames = 0;
          }
        }
      });

      textPositionsRef.current.forEach((position) => {
        if (position.stableFrames >= STABLE_THRESHOLD) {
          const diff = position.target - position.current;
          position.current += diff * 0.08;
        }
      });

      normalAsteroidsRef.current.forEach(a => {
        if (!a.isLarge) {
          a.trail.push({ x: a.x, y: a.y });
          const maxTrailLength = Math.floor(100 / a.speed * 3);
          if (a.trail.length > maxTrailLength) {
            a.trail.shift();
          }
        }
        a.x += a.speed * speedFactorRef.current;
        if (a.x > w + a.radius) {
          a.x = -a.radius;
          a.y = 0.25 * h + Math.random() * h * 0.3;
          a.trail = [];
        }
      });

      largeAsteroidsRef.current.forEach(a => {
        a.x += a.speed * speedFactorRef.current;
        if (a.x > w + a.radius) {
          a.x = -a.radius;
          a.y = 0.25 * h + Math.random() * h * 0.3;
          a.trail = [];
        }
      });

      normalAsteroidsRef.current.forEach(a => drawAsteroid(a));
      largeAsteroidsRef.current.forEach(a => drawAsteroid(a));

      trackedSlotsRef.current.forEach(slot => {
        if (!slot.isActive || !slot.targetId) return;

        const asteroid = largeAsteroidsRef.current.find(a => a.id === slot.targetId);
        if (!asteroid) return;

        const centerX = slot.displayX;
        const centerY = slot.displayY;
        const width = slot.displayWidth;
        const height = slot.displayHeight;
        const boxX = centerX - width / 2;
        const boxY = centerY - height / 2;

        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, width, height);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(trackedTargetX, trackedTargetY);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();

        const planetInfo = trackedPlanetInfoRef.current.get(slot.targetId);
        if (planetInfo) {
          const position = textPositionsRef.current.get(slot.targetId) || { current: 0.5, target: 0.5 };
          const ratio = position.current;
          const linePointX = centerX + (trackedTargetX - centerX) * ratio;
          const linePointY = centerY + (trackedTargetY - centerY) * ratio;
          const textX = linePointX + 15;
          const textY = linePointY;

          ctx.fillStyle = '#fff';
          ctx.font = 'bold 14px Inter, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(planetInfo.name, textX, textY - 5);

          ctx.font = '11px Inter, sans-serif';
          ctx.fillStyle = '#ccc';
          planetInfo.description.forEach((line, index) => {
            ctx.fillText(line, textX, textY + 12 + index * 15);
          });
        }

        ctx.fillStyle = '#fff';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`TARGET | ID: ${slot.targetId}`, boxX, boxY - 5);
        ctx.fillText(`VELOCITY: ${asteroid.speed.toFixed(1)}`, boxX, boxY + height + 15);
      });

      let currentDetection: Asteroid | null = null;
      for (const asteroid of largeAsteroidsRef.current) {
        const distance = Math.sqrt(
          Math.pow(mouseX - asteroid.x, 2) + Math.pow(mouseY - asteroid.y, 2)
        );
        if (distance <= asteroid.radius) {
          currentDetection = asteroid;
          if (detectedAsteroidRef.current !== asteroid) {
            detectedAsteroidRef.current = asteroid;
            if (!asteroid.discoveredId) {
              asteroid.discoveredId = generateDiscoveredId();
            }
            if (!trackedPlanetInfoRef.current.has('mouse_' + asteroid.id)) {
              trackedPlanetInfoRef.current.set('mouse_' + asteroid.id, getNextPlanetInfo());
            }
          }
          break;
        }
      }

      if (!currentDetection && detectedAsteroidRef.current) {
        detectedAsteroidRef.current = null;
      }

      const mouseBoxSize = 30;
      
      // 当检测到小行星时，方框跟随小行星位置；否则跟随鼠标位置
      const boxCenterX = detectedAsteroidRef.current ? detectedAsteroidRef.current.x : mouseX;
      const boxCenterY = detectedAsteroidRef.current ? detectedAsteroidRef.current.y : mouseY;
      const mouseBoxX = boxCenterX - mouseBoxSize / 2;
      const mouseBoxY = boxCenterY - mouseBoxSize / 2;

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(mouseBoxX, mouseBoxY, mouseBoxSize, mouseBoxSize);

      ctx.beginPath();
      ctx.moveTo(boxCenterX, boxCenterY);
      ctx.lineTo(trackedTargetX, trackedTargetY);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();

      if (detectedAsteroidRef.current) {
        const planetInfo = trackedPlanetInfoRef.current.get('mouse_' + detectedAsteroidRef.current.id);
        if (planetInfo) {
          const ratio = 0.5;
          const textX = boxCenterX + (trackedTargetX - boxCenterX) * ratio + 15;
          const textY = boxCenterY + (trackedTargetY - boxCenterY) * ratio;

          ctx.fillStyle = '#fff';
          ctx.font = 'bold 14px Inter, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(planetInfo.name, textX, textY - 5);

          ctx.font = '11px Inter, sans-serif';
          ctx.fillStyle = '#ccc';
          planetInfo.description.forEach((line, index) => {
            ctx.fillText(line, textX, textY + 12 + index * 15);
          });

          ctx.fillStyle = '#fff';
          ctx.font = '10px Inter, sans-serif';
          ctx.fillText(`DISCOVERED ID: ${detectedAsteroidRef.current.discoveredId}`, mouseBoxX, mouseBoxY - 5);
          ctx.fillText(`TARGET ID: ${detectedAsteroidRef.current.id}`, mouseBoxX, mouseBoxY + mouseBoxSize + 15);
          ctx.fillText(`VELOCITY: ${detectedAsteroidRef.current.speed.toFixed(1)}`, mouseBoxX, mouseBoxY + mouseBoxSize + 27);
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [router, generateDiscoveredId, getNextPlanetInfo]);

  return (
    <div className="relative h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />

      <Link
        href="/"
        className="fixed top-8 right-10 z-[100] text-white/60 text-[11px] font-semibold uppercase tracking-[0.1em] px-4 py-2 border border-white/30 bg-black/50 backdrop-blur-sm hover:text-white hover:border-white/80 hover:bg-blue-500/30 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(30,111,255,0.4)] transition-all duration-300"
      >
        ← Back to Main
      </Link>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-xs z-[60] pointer-events-none">
        CLICK LARGE ASTEROIDS TO EXPLORE
      </div>
    </div>
  );
}
