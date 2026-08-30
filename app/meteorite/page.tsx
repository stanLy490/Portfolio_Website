'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ImagePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  src: string;
  title: string;
  description: string;
  hoverText: string[];
  redirectUrl: string;
  isHovered: boolean;
}

const imageData: Omit<ImagePoint, 'x' | 'y' | 'vx' | 'vy' | 'isHovered'>[] = [
  {
    src: '/images/surface_1.jpg',
    width: 80,
    height: 80,
    title: 'Game-based Interaction',
    description: 'Rough texture',
    hoverText: ['A constant struggle with code —', 'and losing to it,', 'again and again.'],
    redirectUrl: '/project/horizon',
  },
  {
    src: '/images/surface_2.jpg',
    width: 80,
    height: 80,
    title: 'Camera Tracking',
    description: 'Smooth surface',
    hoverText: ['Every time the PC runs,', "Pray that it won't break."],
    redirectUrl: '/project/dimensional',
  },
  {
    src: '/images/surface_3.jpg',
    width: 80,
    height: 80,
    title: 'Motion-based Games',
    description: 'Bloody',
    hoverText: ['No one around me likes playing', 'the motion-based games I make.'],
    redirectUrl: '/project/dimensional',
  },
  {
    src: '/images/surface_4.jpg',
    width: 80,
    height: 80,
    title: 'Video Editing',
    description: 'Hard texture',
    hoverText: ['Working nonstop through July 24th,', 'until it turned into', 'a cervical spine injury.'],
    redirectUrl: '/project/dimensional',
  },
  {
    src: '/images/surface_5.jpg',
    width: 80,
    height: 80,
    title: 'Graphic Design',
    description: 'Morbid',
    hoverText: ['Something I will probably do', 'for the rest of my life…'],
    redirectUrl: '/project/visions',
  },
];

export default function MeteoritePage() {
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const pointsRef = useRef<ImagePoint[]>([]);
  const animFrameRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);

  const initPoints = useCallback((w: number, h: number) => {
    const points: ImagePoint[] = imageData.map((data) => ({
      ...data,
      x: Math.random() * (w - 200) + 100,
      y: Math.random() * (h - 200) + 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      isHovered: false,
    }));
    pointsRef.current = points;
  }, []);

  useEffect(() => {
    const glCanvas = glCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!glCanvas || !overlayCanvas) return;

    const gl = glCanvas.getContext('webgl');
    const ctx = overlayCanvas.getContext('2d');
    if (!gl || !ctx) return;

    glRef.current = gl;

    let w = window.innerWidth;
    let h = window.innerHeight;
    glCanvas.width = w;
    glCanvas.height = h;
    overlayCanvas.width = w;
    overlayCanvas.height = h;

    initPoints(w, h);

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      
      float noise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        vec3 color = vec3(0.0);
        
        float n = noise(vec3(uv * 10.0, u_time * 0.1));
        color = vec3(n * 0.1);
        
        float dist = length(uv - vec2(0.5));
        color += vec3(0.05) * (1.0 - dist);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      glCanvas.width = w;
      glCanvas.height = h;
      overlayCanvas.width = w;
      overlayCanvas.height = h;
      gl.viewport(0, 0, w, h);
      initPoints(w, h);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      for (const point of pointsRef.current) {
        const dx = clickX - (point.x + point.width / 2);
        const dy = clickY - (point.y + point.height / 2);
        if (Math.abs(dx) < point.width / 2 && Math.abs(dy) < point.height / 2) {
          router.push(point.redirectUrl);
          return;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    overlayCanvas.addEventListener('mousemove', handleMouseMove);
    overlayCanvas.addEventListener('click', handleClick);

    let startTime = Date.now();

    const animate = () => {
      const time = (Date.now() - startTime) / 1000;

      gl.viewport(0, 0, w, h);
      gl.uniform2f(resolutionLocation, w, h);
      gl.uniform1f(timeLocation, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      ctx.clearRect(0, 0, w, h);

      pointsRef.current.forEach((point) => {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x <= 0 || point.x + point.width >= w) point.vx *= -1;
        if (point.y <= 0 || point.y + point.height >= h) point.vy *= -1;

        const dx = mousePos.x - (point.x + point.width / 2);
        const dy = mousePos.y - (point.y + point.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        point.isHovered = distance < 100;

        if (point.isHovered) {
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
          ctx.lineWidth = 2;
          ctx.strokeRect(point.x - 2, point.y - 2, point.width + 4, point.height + 4);

          ctx.fillStyle = 'rgba(0, 255, 255, 0.9)';
          ctx.font = '12px monospace';
          point.hoverText.forEach((text, i) => {
            ctx.fillText(text, point.x, point.y - 20 - (point.hoverText.length - 1 - i) * 16);
          });
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(point.x, point.y, point.width, point.height);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px monospace';
        ctx.fillText(point.title, point.x, point.y + point.height + 15);
      });

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(mousePos.x - 15, mousePos.y - 15, 30, 30);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      overlayCanvas.removeEventListener('mousemove', handleMouseMove);
      overlayCanvas.removeEventListener('click', handleClick);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [mousePos, router, initPoints]);

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      <canvas ref={glCanvasRef} className="absolute inset-0 z-10" />
      <canvas ref={overlayCanvasRef} className="absolute inset-0 z-20" />

      <Link
        href="/galaxy"
        className="fixed top-5 right-8 z-[100] text-white/50 text-base font-semibold no-underline px-2 py-1 hover:text-white hover:scale-110 transition-all duration-300"
      >
        &times; Close
      </Link>
    </div>
  );
}
