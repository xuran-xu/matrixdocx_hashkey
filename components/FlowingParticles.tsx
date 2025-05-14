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
      // 增加粒子数量
      const particleCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 20000), 150);
      
      for (let i = 0; i < particleCount; i++) {
        const goldColors = [
          '#E4BE7D', // Primary gold
          '#D7B06E', // Darker gold
          '#F0D393', // Lighter gold
          '#BCA372', // Muted gold
        ];
        
        // 将粒子集中在"Hold gold effortlessly, earn rewards securely"下方区域
        // 根据页面中的位置，这大约是页面高度的30%-40%处
        const targetY = canvas.height * 0.35; // 目标文本位置
        const distributionHeight = canvas.height * 0.3; // 更大的分布高度范围
        
        particles.current.push({
          x: Math.random() * canvas.width,
          y: targetY + Math.random() * distributionHeight,
          size: Math.random() * 2 + 0.8, // 更大的粒子
          speedX: (Math.random() * 0.2 - 0.1) * 0.5, // 水平移动
          speedY: (Math.random() * 0.2 - 0.1) * 0.4, // 垂直移动
          opacity: Math.random() * 0.4 + 0.2, // 更高的不透明度
          color: goldColors[Math.floor(Math.random() * goldColors.length)]
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.current.forEach(particle => {
        // 简单的漂浮效果
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // 当粒子移出指定区域，将其重置
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.x = Math.random() * canvas.width;
        }
        
        const targetY = canvas.height * 0.35;
        const distributionHeight = canvas.height * 0.3;
        if (particle.y < targetY || particle.y > targetY + distributionHeight) {
          particle.y = targetY + Math.random() * distributionHeight;
        }
        
        // 绘制粒子，确保它们可见
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // 固定透明度格式
        const alpha = Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fillStyle = `${particle.color}${alpha}`;
        ctx.fill();
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
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
} 