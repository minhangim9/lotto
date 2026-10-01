import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getBallColorHex } from '../data/lottoData';

interface LottoSphere3DProps {
  isSpinning: boolean;
  drawnBalls: number[];
  onBallExtracted?: (ballNum: number) => void;
}

export const LottoSphere3D: React.FC<LottoSphere3DProps> = ({ isSpinning }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Ball objects in Three.js
  const ballsRef = useRef<{ mesh: THREE.Mesh; velocity: THREE.Vector3; num: number }[]>([]);
  const cageGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 280;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 9);
    camera.lookAt(0, 0.2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // Clear previous children
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff0c2, 0.9);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xffd700, 3.5, 20);
    goldPointLight.position.set(3, 5, 4);
    scene.add(goldPointLight);

    const blueBackLight = new THREE.PointLight(0x4a90e2, 1.8, 20);
    blueBackLight.position.set(-4, -2, -3);
    scene.add(blueBackLight);

    const cageGroup = new THREE.Group();
    cageGroupRef.current = cageGroup;
    scene.add(cageGroup);

    // 1. Luxury Golden Wireframe Sphere Cage
    const sphereRadius = 2.4;
    const cageGeo = new THREE.SphereGeometry(sphereRadius, 24, 16);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    cageGroup.add(cageMesh);

    // 2. Glass Enclosure for reflections
    const glassGeo = new THREE.SphereGeometry(sphereRadius * 0.99, 32, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a2e,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.35,
      reflectivity: 0.6
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    cageGroup.add(glassMesh);

    // 3. Golden Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(2.1, 2.5, 0.4, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xb38728,
      metalness: 0.9,
      roughness: 0.3
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, -2.6, 0);
    cageGroup.add(baseMesh);

    // 4. Create 45 Lotto Balls inside
    const ballRadius = 0.26;
    const ballGeo = new THREE.SphereGeometry(ballRadius, 16, 16);
    const balls: { mesh: THREE.Mesh; velocity: THREE.Vector3; num: number }[] = [];

    // Helper canvas texture for ball numbers
    const createBallTexture = (num: number, colorHex: string) => {
      const cvs = document.createElement('canvas');
      cvs.width = 128;
      cvs.height = 128;
      const ctx = cvs.getContext('2d')!;

      // Background
      ctx.fillStyle = colorHex;
      ctx.beginPath();
      ctx.arc(64, 64, 62, 0, Math.PI * 2);
      ctx.fill();

      // Inner white disc
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(64, 64, 32, 0, Math.PI * 2);
      ctx.fill();

      // Number text
      ctx.fillStyle = '#111111';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(num.toString(), 64, 65);

      const texture = new THREE.CanvasTexture(cvs);
      return texture;
    };

    for (let i = 1; i <= 45; i++) {
      const colorHex = getBallColorHex(i);
      const texture = createBallTexture(i, colorHex);

      const ballMat = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.3,
        roughness: 0.4
      });

      const ballMesh = new THREE.Mesh(ballGeo, ballMat);

      // Random starting positions inside inner sphere
      const r = (sphereRadius - ballRadius - 0.2) * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      ballMesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      cageGroup.add(ballMesh);

      balls.push({
        mesh: ballMesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05
        ),
        num: i
      });
    }
    ballsRef.current = balls;

    // Interactive Drag Rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !cageGroupRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      cageGroupRef.current.rotation.y += deltaX * 0.01;
      cageGroupRef.current.rotation.x += deltaY * 0.01;

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Cage rotation
      if (cageGroupRef.current) {
        if (!isDragging) {
          cageGroupRef.current.rotation.y += isSpinning ? delta * 3.5 : delta * 0.4;
        }
      }

      // Ball Physics Simulation
      const speedMultiplier = isSpinning ? 4.8 : 0.8;
      const maxR = sphereRadius - ballRadius - 0.1;

      ballsRef.current.forEach((ball) => {
        const mesh = ball.mesh;

        if (isSpinning) {
          // Centrifugal turbulence & upward vacuum lift
          ball.velocity.x += (Math.random() - 0.5) * 0.08;
          ball.velocity.y += (Math.random() - 0.3) * 0.09;
          ball.velocity.z += (Math.random() - 0.5) * 0.08;
        } else {
          // Gentle floating gravity
          ball.velocity.y -= delta * 0.2;
        }

        // Limit max velocity
        ball.velocity.clampLength(0, 0.2 * speedMultiplier);

        mesh.position.addScaledVector(ball.velocity, speedMultiplier);

        // Spherical boundary collision
        const dist = mesh.position.length();
        if (dist > maxR) {
          mesh.position.setLength(maxR);
          // Reflect velocity on sphere normal
          const normal = mesh.position.clone().normalize();
          ball.velocity.reflect(normal).multiplyScalar(0.85);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const newWidth = container.clientWidth || 360;
      const newHeight = container.clientHeight || 280;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none overflow-hidden py-1">
      {/* 3D Canvas Mount */}
      <div 
        ref={mountRef} 
        className="w-full h-64 sm:h-72 cursor-grab active:cursor-grabbing flex items-center justify-center relative z-10"
        title="화면을 터치하거나 드래그하여 3D 로또 추첨기를 회전시켜보세요"
      />

      {/* Decorative Golden Floor Reflection / Ambient Glow */}
      <div className="absolute -bottom-4 w-48 h-8 bg-luxury-gold/20 rounded-full blur-xl pointer-events-none"></div>

      {/* Touch Guide Indicator */}
      <div className="text-[11px] text-luxury-gold/70 tracking-widest uppercase flex items-center gap-1.5 -mt-2 pointer-events-none">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-luxury-gold animate-ping"></span>
        3D Real-time Physics Engine
      </div>
    </div>
  );
};
