'use client';

import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

export default function FlowingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Initialize particles
    const initParticles = () => {
      particles.current = [];
      const particleCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 5000), 400);
      
      for (let i = 0; i < particleCount; i++) {
        const goldColors = [
          '#E4BE7D', // Primary gold
          '#D7B06E', // Darker gold
          '#F0D393', // Lighter gold
          '#BCA372', // Muted gold
        ];
        
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.3 - 0.15,
          opacity: Math.random() * 0.7 + 0.3,
          color: goldColors[Math.floor(Math.random() * goldColors.length)]
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.current.forEach(particle => {
        // Update position with flowing effect
        const time = Date.now() * 0.001;
        const flowX = Math.sin(time + particle.y * 0.01) * 0.3;
        
        particle.x += particle.speedX + flowX;
        particle.y += particle.speedY - 0.1; // Slow upward drift
        
        // Reset particles that go off-screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw the particle with glow effect
        ctx.save();
        ctx.beginPath();
        
        // 添加模糊效果
        ctx.shadowBlur = 6;
        ctx.shadowColor = particle.color;
        
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        const alpha = Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fillStyle = particle.color + alpha;
        ctx.fill();
        ctx.restore();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Set up canvas and start animation
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-50"
      style={{ pointerEvents: 'none' }}
    />
  );
} 