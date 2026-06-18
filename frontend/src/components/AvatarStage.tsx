import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { SignToken } from '../types';

interface AvatarStageProps {
  tokens: SignToken[];
  mode: 'male' | 'female' | 'child';
  speed: number;
  skinTone: string;
  clothes: string;
}

export function AvatarStage({ tokens, mode, speed, skinTone, clothes }: AvatarStageProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#fff8ea');
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 100);
    camera.position.set(0, 1.4, 5);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight('#ffffff', '#f39b6d', 2.6);
    scene.add(light);
    const keyLight = new THREE.DirectionalLight('#ffffff', 1.5);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const group = new THREE.Group();
    const bodyScale = mode === 'child' ? 0.82 : 1;
    group.scale.setScalar(bodyScale);
    scene.add(group);

    const skin = new THREE.MeshStandardMaterial({ color: skinTone });
    const outfit = new THREE.MeshStandardMaterial({ color: clothes });
    const accent = new THREE.MeshStandardMaterial({ color: '#5f4b32' });

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 32, 24), skin);
    head.position.y = 2.28;
    group.add(head);

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 1.1, 12, 24), outfit);
    torso.position.y = 1.22;
    group.add(torso);

    const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 1.12, 8, 16), skin);
    const rightArm = leftArm.clone();
    leftArm.position.set(-0.85, 1.45, 0);
    rightArm.position.set(0.85, 1.45, 0);
    group.add(leftArm, rightArm);

    const hands = [-1, 1].map((side) => {
      const hand = new THREE.Group();
      const palm = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), skin);
      hand.add(palm);
      for (let i = 0; i < 5; i += 1) {
        const finger = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.28, 6, 8), skin);
        finger.position.set((i - 2) * 0.06, 0.16, 0.02);
        finger.rotation.z = (i - 2) * 0.08;
        hand.add(finger);
      }
      hand.position.set(side * 1.05, 1.1, 0.25);
      group.add(hand);
      return hand;
    });

    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), accent);
    const eyeR = eyeL.clone();
    eyeL.position.set(-0.16, 2.35, 0.43);
    eyeR.position.set(0.16, 2.35, 0.43);
    group.add(eyeL, eyeR);

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      const elapsed = clock.getElapsedTime() * speed;
      const activeToken = tokens.length ? tokens[Math.floor(elapsed) % tokens.length] : undefined;
      const wave = Math.sin(elapsed * 3.2) * 0.35;
      hands[0].position.x = -0.72 + Math.sin(elapsed * 1.6) * 0.18;
      hands[0].position.y = 1.18 + wave;
      hands[1].position.x = 0.72 + Math.cos(elapsed * 1.6) * 0.18;
      hands[1].position.y = 1.18 - wave * 0.75;
      hands[0].rotation.z = wave;
      hands[1].rotation.z = -wave;
      head.rotation.y = Math.sin(elapsed * 0.8) * 0.12;
      torso.rotation.y = Math.sin(elapsed * 0.5) * 0.04;
      if (activeToken?.expression === 'question') {
        head.rotation.z = Math.sin(elapsed * 4) * 0.04;
      }
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      camera.aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    });
    resizeObserver.observe(mount);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [tokens, mode, speed, skinTone, clothes]);

  return (
    <div className="avatar-stage" aria-label="3D AI sign-language avatar">
      <div ref={mountRef} className="avatar-canvas" />
      <div className="avatar-caption" aria-live="polite">
        {tokens.length ? tokens.map((token) => token.gloss).join(' → ') : 'Avatar ready for sign sequence'}
      </div>
    </div>
  );
}
