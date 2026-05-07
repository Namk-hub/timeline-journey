import React, { useEffect, useMemo, useRef } from 'react';

function hexToRgb(hex) {
  const safeHex = hex.replace('#', '');
  if (safeHex.length !== 6) return { r: 255, g: 255, b: 255 };
  return {
    r: Number.parseInt(safeHex.slice(0, 2), 16),
    g: Number.parseInt(safeHex.slice(2, 4), 16),
    b: Number.parseInt(safeHex.slice(4, 6), 16),
  };
}

export default function Particles({
  particleCount = 390,
  particleSpread = 7,
  speed = 0.28,
  particleColors = ['#ffffff'],
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
}) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false });

  const normalizedSize = useMemo(
    () => Math.max(0.8, Math.min(3.2, particleBaseSize / 65)),
    [particleBaseSize]
  );

  const depthScale = useMemo(
    () => Math.max(0.65, Math.min(1.6, cameraDistance / 20)),
    [cameraDistance]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * window.devicePixelRatio);
      canvas.height = Math.floor(height * window.devicePixelRatio);
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    const makeParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, (_, i) => {
        const color = hexToRgb(particleColors[i % particleColors.length] || '#ffffff');
        const depth = 0.35 + Math.random() * 1.25;
        return {
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 0.00095 * particleSpread,
          vy: (Math.random() - 0.5) * 0.00095 * particleSpread,
          seed: Math.random() * Math.PI * 2,
          depth,
          size:
            (normalizedSize * (0.55 + Math.random() * sizeRandomness)) /
            Math.max(0.2, depth),
          color,
        };
      });
    };

    const update = () => {
      time += 0.008 * (disableRotation ? 0.4 : 1);

      ctx.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;
      const centerX = pointer.active ? pointer.x : 0.5;
      const centerY = pointer.active ? pointer.y : 0.5;

      for (const p of particlesRef.current) {
        const wobble = disableRotation ? 0 : Math.sin(time + p.seed) * 0.0006;
        p.x += p.vx * speed * (1 / p.depth) + wobble;
        p.y += p.vy * speed * (1 / p.depth) + wobble * 0.7;

        if (p.x < -0.03) p.x = 1.03;
        if (p.x > 1.03) p.x = -0.03;
        if (p.y < -0.03) p.y = 1.03;
        if (p.y > 1.03) p.y = -0.03;

        let drawX = p.x * width;
        let drawY = p.y * height;

        if (moveParticlesOnHover) {
          const push = 1 + particleHoverFactor * 0.8;
          drawX += (centerX - 0.5) * 40 * push * (2 - p.depth);
          drawY += (centerY - 0.5) * 40 * push * (2 - p.depth);
        }

        const radius = Math.max(0.45, p.size * depthScale);
        const alpha = alphaParticles ? 0.2 + (1 / p.depth) * 0.35 : 0.95;
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = window.requestAnimationFrame(update);
    };

    const onMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
        active: true,
      };
    };

    const onMouseLeave = () => {
      pointerRef.current.active = false;
    };

    resize();
    makeParticles();
    update();

    window.addEventListener('resize', resize);
    if (moveParticlesOnHover) {
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseleave', onMouseLeave);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      if (moveParticlesOnHover) {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [
    alphaParticles,
    cameraDistance,
    disableRotation,
    moveParticlesOnHover,
    normalizedSize,
    particleBaseSize,
    particleColors,
    particleCount,
    particleHoverFactor,
    particleSpread,
    sizeRandomness,
    speed,
    depthScale,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    />
  );
}
