import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene, camera, renderer, particles;
    let animationId;
    let mouseX = 0;
    let mouseY = 0;

    const initThree = () => {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 50;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      createParticles();
    };

    const createParticles = () => {
      const particleCount = window.innerWidth < 768 ? 500 : 1500;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      // Keep signature brand yellow/gold in both themes, using soft silver as secondary
      const primaryColor = new THREE.Color(0xD4AF37);
      const secondaryColor = theme === 'dark' ? new THREE.Color(0xEDEDED) : new THREE.Color(0xCBD5E1);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 100;

        const color = Math.random() > 0.5 ? primaryColor : secondaryColor;
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: theme === 'dark' ? 0.15 : 0.15,
        vertexColors: true,
        transparent: true,
        opacity: theme === 'dark' ? 0.8 : 0.5,
        blending: theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (particles) {
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;

        particles.position.x += (mouseX * 0.05 - particles.position.x) * 0.05;
        particles.position.y += (-mouseY * 0.05 - particles.position.y) * 0.05;
      }

      renderer.render(scene, camera);
    };

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    initThree();
    animate();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (renderer) {
        renderer.dispose();
      }
      if (particles) {
        particles.geometry.dispose();
        particles.material.dispose();
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
