import React, { useEffect, useRef } from 'react';

interface FloatingPetalsProps {
  active: boolean;
  theme?: string;
}

export const FloatingPetals: React.FC<FloatingPetalsProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle types: Rose Petals & Golden Shimmer dust
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      angle: number;
      angularSpeed: number;
      opacity: number;
      type: 'petal' | 'gold';
      color: string;
    }

    const particles: Particle[] = [];
    const count = 35;

    const colors = [
      'rgba(244, 63, 94, 0.55)', // Rose petal pink
      'rgba(251, 113, 133, 0.45)',
      'rgba(245, 158, 11, 0.65)', // Gold shimmer
      'rgba(253, 224, 71, 0.7)',
      'rgba(255, 255, 255, 0.5)'
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 3,
        speedX: Math.sin(Math.random() * Math.PI) * 0.8 - 0.4,
        speedY: Math.random() * 0.9 + 0.4,
        angle: Math.random() * 360,
        angularSpeed: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.5 + 0.3,
        type: i % 2 === 0 ? 'petal' : 'gold',
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.8 + p.speedX;
        p.angle += p.angularSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);

        if (p.type === 'petal') {
          // Draw delicate curved rose petal
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 1.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          // Draw diamond gold sparkle
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.4, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.4, 0);
          ctx.closePath();
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
