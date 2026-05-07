import React, { useEffect, useMemo, useRef } from 'react';

const DEFAULTS = {
  lineCount: 140,
  lineBaseWidth: 1,
  lineWidthVariance: 1.4,
  lineSpeed: 1.2,
  glowStrength: 0.72,
  perspective: 1,
  hue: 210,
  saturation: 90,
  lightness: 68,
};

export default function Hyperspeed({ effectOptions = {} }) {
  const canvasRef = useRef(null);
  const linesRef = useRef([]);
  const options = useMemo(() => ({ ...DEFAULTS, ...effectOptions }), [effectOptions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let rafId = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * window.devicePixelRatio);
      canvas.height = Math.floor(height * window.devicePixelRatio);
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    const resetLine = (line, spawnNear = false) => {
      line.z = spawnNear ? Math.random() * 0.6 : 0.75 + Math.random() * 1.6;
      line.depth = 0.2 + Math.random() * 1.8;
      line.x = (Math.random() * 2 - 1) * 1.1;
      line.y = (Math.random() * 2 - 1) * 1.1;
      line.length = 0.02 + Math.random() * 0.11;
      line.width = options.lineBaseWidth + Math.random() * options.lineWidthVariance;
    };

    const createLines = () => {
      linesRef.current = Array.from({ length: options.lineCount }, () => {
        const line = {};
        resetLine(line, true);
        return line;
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const line of linesRef.current) {
        line.z -= 0.01 * options.lineSpeed * line.depth;
        if (line.z <= 0.03) {
          resetLine(line);
        }

        const perspective = (options.perspective / line.z) * 0.5;
        const px = width * 0.5 + line.x * width * perspective;
        const py = height * 0.5 + line.y * height * perspective;
        const tail = line.length * height * perspective * 0.95;

        const alpha = Math.max(0.08, Math.min(1, 1.05 - line.z * 0.45));
        ctx.strokeStyle = `hsla(${options.hue}, ${options.saturation}%, ${options.lightness}%, ${alpha})`;
        ctx.lineWidth = line.width * (0.5 + perspective * 0.7);
        ctx.shadowColor = `hsla(${options.hue}, ${options.saturation}%, ${options.lightness}%, ${Math.min(0.95, alpha)})`;
        ctx.shadowBlur = 8 * options.glowStrength;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + line.x * tail, py + line.y * tail);
        ctx.stroke();
      }

      rafId = window.requestAnimationFrame(draw);
    };

    resize();
    createLines();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [options]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    />
  );
}
