import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';

type BoxVisualizationProps = {
  accelerometerData: {
    x: number;
    y: number;
    z: number;
    magnitude: number;
  };
};

const BoxModel: React.FC<BoxVisualizationProps> = ({ accelerometerData }) => {
  const gltf = useLoader(GLTFLoader, 'src/models/cardboard_box.glb');
  const trackerTexture = useLoader(TextureLoader, 'src/models/ccard.png');
  const boxRef = useRef<any>();

  useEffect(() => {
    // Convert accelerometer data to radians for rotation
    const rotationX = (Math.atan2(accelerometerData.y, accelerometerData.z) * 180) / Math.PI;
    const rotationY = (Math.atan2(accelerometerData.x, accelerometerData.z) * 180) / Math.PI;

    if (boxRef.current) {
      boxRef.current.rotation.set(rotationX, rotationY, 0);

      // Handle movement and shock events based on accelerometer data
      if (accelerometerData.magnitude < 600) {
        // Illustrate falling motion
        boxRef.current.position.y -= 0.01; // Adjust the falling speed as needed
      } else if (accelerometerData.magnitude >= 600 && accelerometerData.magnitude <= 1400) {
        // Indicate movement due to an external force
        boxRef.current.position.x += accelerometerData.x * 0.01; // Adjust the movement speed based on accelerometer data
        boxRef.current.position.y += accelerometerData.y * 0.01;
        boxRef.current.position.z += accelerometerData.z * 0.01;
      }

      // Additional logic for shock event visualization
      // Include logic to illustrate the direction of the shock event
    }
  }, [accelerometerData]);

  return (
    <mesh ref={boxRef}>
      <primitive object={gltf.scene}>
        {/* <meshStandardMaterial attach="material" map={trackerTexture} /> */}
      </primitive>
    </mesh>
  );
};

const BoxVisualization: React.FC<BoxVisualizationProps> = (props) => {
  return (
    <Canvas className=' h-[300px] ' camera={{ position: [0, 0, 1] }}>
      <ambientLight intensity={1.5} />
      <BoxModel {...props} />
      <OrbitControls />
    </Canvas>
  );
};

export default BoxVisualization;