import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function BoxVisualizer({ className, data }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const shockEvent = data.reduce((max, point) => point.magnitude > max.magnitude ? point : max, data[0]);
      const { x, y, z } = shockEvent;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const normalizedX = x / magnitude;
      const normalizedY = y / magnitude;
      const normalizedZ = z / magnitude;
      
      // Use normalizedX, normalizedY, and normalizedZ to update cube orientation
    }
  }, [data]);

  return <div className={className} ref={mountRef} />;
}

export default BoxVisualizer;
