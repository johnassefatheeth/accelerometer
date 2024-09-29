import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader, Vector3 } from 'three';
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
  const arrowRef = useRef<THREE.Group | null>(null);

  const targetPosition = useRef(new Vector3(0, 0, 0));
  const targetRotation = useRef(new Vector3(0, 0, 0));

  useEffect(() => {
    if (!boxRef.current || !fallingRef.current) return;
  
    if (accelerometerData.magnitude <= 600 || accelerometerData.magnitude >= 1400) {
      return;
    }

    // Calculate rotation based on accelerometer data
    const rotationX = Math.atan2(accelerometerData.y, accelerometerData.z);
    const rotationY = Math.atan2(accelerometerData.x, accelerometerData.z);
  
    targetRotation.current.set(rotationX, rotationY, 0);
  }, [accelerometerData, maxMagnitudeSample?.magnitude]);
  

  useFrame(({ camera }) => {
    if (!fallingRef.current || !boxRef.current) return;

    fallingRef.current.position.lerp(targetPosition.current, 0.1);

    boxRef.current.rotation.x = THREE.MathUtils.lerp(boxRef.current.rotation.x, targetRotation.current.x, 0.1);
    boxRef.current.rotation.y = THREE.MathUtils.lerp(boxRef.current.rotation.y, targetRotation.current.y, 0.1);
    boxRef.current.rotation.z = THREE.MathUtils.lerp(boxRef.current.rotation.z, targetRotation.current.z, 0.1);

    camera.position.lerp(
      new Vector3(
        fallingRef.current.position.x ,
        fallingRef.current.position.y , 
        fallingRef.current.position.z + 1.2
      ),
      1
    );

    camera.lookAt(fallingRef.current.position);
  });

  const speedLines = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const x = Math.cos(angle) * 2.5;
      const z = Math.sin(angle) * 2.5;

      const geometry = new THREE.BufferGeometry().setFromPoints([
        new Vector3(x * 0.2, -0.2, z * 0.2),
        new Vector3(x * 0.5, 1.5, z * 0.5),   
      ]);

      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(0x000000),  
        linewidth: 0.51, 
        opacity: 0.2,    
        transparent: true,
      });

      return <lineSegments key={i} geometry={geometry} material={material} />;
    });
  }, []);

  const arrows = useMemo(() => {
    const accelVector = new Vector3(
      maxMagnitudeSample.coordinates.y,
      maxMagnitudeSample.coordinates.x,
      maxMagnitudeSample.coordinates.z
    ).normalize();

    const arrowDir = new THREE.ArrowHelper(
      accelVector,           
      new Vector3(0, 0, 0),  
      2,                     
      0xff0000,              
      0.2,                
      0.2                    
    );


    const arrowPosition = accelVector.clone().multiplyScalar(-1.3);
    return (
      <group ref={arrowRef}  position={arrowPosition}>
        <primitive object={arrowDir} />
      </group>
    );
  }, [maxMagnitudeSample]);

  return (
    <group ref={fallingRef}>
      <group ref={boxRef} position={[0,0,0]}>
        <primitive object={gltf.scene} />
        <Text position={[0, 0, 0.32]} fontSize={0.1} color="gray">Front</Text>
        <Text position={[0, 0, -0.32]} rotation={[0, Math.PI, 0]} fontSize={0.1} color="gray">Back</Text>
        <Text position={[0.4, 0, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.1} color="gray">Right</Text>
        <Text position={[-0.4, 0, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.1} color="gray">Left</Text>
        <Text position={[0, 0.23, 0]} rotation={[Math.PI / 2, 9.5, 0]} fontSize={0.1} color="gray">Top</Text>
        <Text position={[0, -0.23, 0]} rotation={[-Math.PI / 2, 9.45, 0]} fontSize={0.1} color="gray">Bottom</Text>

        <mesh position={[0.2, 0.134, 0.31]} scale={[1.5, 1.5, 1]}>
          <planeGeometry args={[0.15, 0.08]} />
          <meshStandardMaterial map={trackerTexture} transparent={true} />
        </mesh>
        <mesh position={[0.2, 0.1948, 0.268]} scale={[1.5, 1, 1]} rotation={[Math.PI / -2, 0, 0]}>
          <planeGeometry args={[0.15, 0.08]} />
          <meshStandardMaterial map={trackerTexture2} transparent={true} />
        </mesh>
      </group>
      <group>
        {accelerometerData.magnitude < 600 && speedLines}
        {accelerometerData.magnitude < 600 && <Text position={[0, 0.8, 0]} fontSize={0.1} color="gray">free fall</Text>}
      </group>
      {accelerometerData.magnitude === maxMagnitudeSample?.magnitude && arrows}
    </group>
  );
};

const BoxVisualization: React.FC<BoxVisualizationProps> = (props) => {
  return (
    <Canvas>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} />
      <BoxModel {...props} />
      <OrbitControls />
    </Canvas>
  );
};

export default BoxVisualization;
