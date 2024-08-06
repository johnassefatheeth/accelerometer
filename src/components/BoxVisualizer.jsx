import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function BoxVisualizer({ className, data }) {
  const mountRef = useRef(null);
  const cubeRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Set up the scene
    const scene = new THREE.Scene();

    // Set up the camera
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Set up the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Set up OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Set up the box geometry and material
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);

    // Store the cube reference
    cubeRef.current = cube;

    // Add the cube to the scene
    scene.add(cube);

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      mount.removeChild(renderer.domElement);
      controls.dispose();
    };
  }, []);

  useEffect(() => {
    if (data.length > 0 && cubeRef.current) {
      const shockEvent = data.reduce((max, point) => point.magnitude > max.magnitude ? point : max, data[0]);
      const { x, y, z } = shockEvent;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const normalizedX = x / magnitude;
      const normalizedY = y / magnitude;
      const normalizedZ = z / magnitude;

      // Update cube orientation based on normalized accelerometer data
      const cube = cubeRef.current;
      cube.rotation.x = normalizedX * Math.PI;
      cube.rotation.y = normalizedY * Math.PI;
      cube.rotation.z = normalizedZ * Math.PI;
    }
  }, [data]);

  return <div className={className} ref={mountRef} style={{ width: '100%', height: '500px', border: '1px solid black' }} />;
}

export default BoxVisualizer;
