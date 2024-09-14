import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader, Vector3, MathUtils, Euler } from 'three';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

type BoxVisualizationProps = {
  accelerometerData: {
    x: number;
    y: number;
    z: number;
    magnitude: number;
    isSignificantShock: boolean;
  },
  maxMagnitudeSample: {
    magnitude: number,
    coordinates: {
      x: number;
      y: number;
      z: number;
    }
  }
};

const BoxModel: React.FC<BoxVisualizationProps> = ({ accelerometerData, maxMagnitudeSample }) => {
  const gltf = useLoader(GLTFLoader, 'src/models/cardboard_box.glb');
  const trackerTexture = useLoader(TextureLoader, 'src/models/ccard.png');
  const trackerTexture2 = useLoader(TextureLoader, 'src/models/ccard2.png');

  const fallingRef = useRef<THREE.Group | null>(null);
  const boxRef = useRef<THREE.Group | null>(null);
  const arrowRef = useRef<THREE.Mesh | null>(null);

  const targetPosition = useRef(new Vector3(0, 0, 0));
  const targetRotation = useRef(new Vector3(0, 0, 0));
  const speedLinesRotation = useRef(new Euler(0, 0, 0));

  useEffect(() => {
    if (!boxRef.current || !fallingRef.current) return;
  
    if (accelerometerData.magnitude <= 600 || accelerometerData.magnitude >= 1400) {
      return;
    }
  
    // Calculate rotation based on accelerometer data
    const rotationX = Math.atan2(accelerometerData.y, accelerometerData.z);
    const rotationY = Math.atan2(accelerometerData.x, accelerometerData.z);
  
    targetRotation.current.set(rotationX, rotationY, 0);
  
    let newPosition = fallingRef.current.position.clone();
    const fallSpeedMultiplier = 0.4; // Controls the speed of the falling effect
  
    // Update position based on accelerometer data
    if (accelerometerData.magnitude < 600) {
      newPosition.y -= 0.01 * fallSpeedMultiplier;
    } else if (accelerometerData.magnitude >= 600 && accelerometerData.magnitude <= 1400) {
      newPosition.x += accelerometerData.x * 0.01;
      newPosition.y += accelerometerData.y * 0.01 * fallSpeedMultiplier;
      newPosition.z += accelerometerData.z * 0.01;
    }
  
    targetPosition.current.copy(newPosition);
  }, [accelerometerData, maxMagnitudeSample?.magnitude]);
  

  useFrame(({ camera }) => {
    if (!fallingRef.current || !boxRef.current) return;

    // Smoothly update the position of the falling group
    fallingRef.current.position.lerp(targetPosition.current, 0.1);

    // Apply rotation only to the box
    boxRef.current.rotation.x = MathUtils.lerp(boxRef.current.rotation.x, targetRotation.current.x, 0.1);
    boxRef.current.rotation.y = MathUtils.lerp(boxRef.current.rotation.y, targetRotation.current.y, 0.1);
    boxRef.current.rotation.z = MathUtils.lerp(boxRef.current.rotation.z, targetRotation.current.z, 0.1);

    
    // Update camera position to follow the box
    camera.position.lerp(
      new Vector3(
        fallingRef.current.position.x + 0.5,
        fallingRef.current.position.y + 0.5, // Offset the camera slightly above the box
        fallingRef.current.position.z + 1.5  // Keep the camera behind the box
      ),
      1
    );

    camera.lookAt(fallingRef.current.position);
  });

  // Create speed lines
  const speedLines = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const x = Math.cos(angle) * 2.5;
      const z = Math.sin(angle) * 2.5;

      // Define the geometry for each line with tapered ends
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new Vector3(x * 0.2, -0.2, z * 0.2),  // Top of the line (narrower)
        new Vector3(x * 0.5, 1.5, z * 0.5),    // Bottom of the line (wider)
      ]);

      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(0x000000),  // Black color
        linewidth: 0.51,      // Dynamic width for realism
        opacity: 0.2,     // Dynamic opacity for depth
        transparent: true,
      });

      return <lineSegments key={i} geometry={geometry} material={material} />;
    });
  }, []);

  const arrows = useMemo(() => {
    if (!fallingRef.current) return [];

    // Calculate the direction from the box to the shock event
    const shockDirection = new Vector3(
      maxMagnitudeSample.coordinates.x ,
      maxMagnitudeSample.coordinates.y ,
      maxMagnitudeSample.coordinates.z 
    ).normalize();

    // Calculate the arrow's rotation based on the shock direction
    const arrowRotation = new Euler().setFromVector3(shockDirection);

    // Set position slightly outside the box in the direction of the shock event
    const arrowPosition = shockDirection.clone().multiplyScalar(0.75);

    // Return the arrow meshes with static position and rotation
    return Array.from({ length: 2 }, (_, i) => (
      <mesh
        key={i}
        position={arrowPosition.toArray()} // Set position directly in the mesh
        rotation={arrowRotation.toArray()} // Set rotation directly in the mesh
      >
        <cylinderGeometry args={[0.02, 0.1, 0.4, 8]} />
        <meshStandardMaterial color="red" />
      </mesh>
    ));
  }, [maxMagnitudeSample]);
  return (
    <group ref={fallingRef}>
      <group ref={boxRef}>
        <primitive object={gltf.scene} />
        <Text position={[0, 0, 0.32]} fontSize={0.1} color="gray">Front</Text>
        <Text position={[0, 0, -0.32]} rotation={[0, Math.PI, 0]} fontSize={0.1} color="gray">Back</Text>
        <Text position={[0.4, 0, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.1} color="gray">Right</Text>
        <Text position={[-0.4, 0, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.1} color="gray">Left</Text>
        <Text position={[0, 0.23, 0]} rotation={[Math.PI / 2, 0, 0]} fontSize={0.1} color="gray">Top</Text>
        <Text position={[0, -0.23, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.1} color="gray">Bottom</Text>

        <mesh position={[0.2, 0.134, 0.31]} scale={[1.5, 1.5, 1]}>
          <planeGeometry args={[0.15, 0.08]} />
          <meshStandardMaterial map={trackerTexture} transparent={true} />
        </mesh>
        <mesh position={[0.2, 0.1948, 0.268]} scale={[1.5, 1, 1]} rotation={[Math.PI / -2, 0, 0]}>
          <planeGeometry args={[0.15, 0.08]} />
          <meshStandardMaterial map={trackerTexture2} transparent={true} />
        </mesh>
      </group>
      <group >
        {accelerometerData.magnitude <600 || accelerometerData.magnitude >1400 && speedLines}
      </group>
      {accelerometerData.magnitude === maxMagnitudeSample?.magnitude && arrows}
    </group>
  );
};

const BoxVisualization: React.FC<BoxVisualizationProps> = (props) => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <BoxModel {...props} />
      <OrbitControls />
    </Canvas>
  );
};

export default BoxVisualization;
