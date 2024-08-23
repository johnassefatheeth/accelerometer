import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader, Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';

type BoxVisualizationProps = {
  accelerometerData: {
    x: number;
    y: number;
    z: number;
    magnitude: number;
    isSignificantShock: boolean; // Add this flag to indicate if it's the most significant shock
  };
};

const BoxModel: React.FC<BoxVisualizationProps> = ({ accelerometerData }) => {
  const gltf = useLoader(GLTFLoader, 'src/models/cardboard_box.glb');
  const trackerTexture = useLoader(TextureLoader, 'src/models/ccard.png');
  const boxRef = useRef<any>();

  useEffect(() => {
    const rotationX = (Math.atan2(accelerometerData.y, accelerometerData.z) * 180) / Math.PI;
    const rotationY = (Math.atan2(accelerometerData.x, accelerometerData.z) * 180) / Math.PI;

    if (boxRef.current) {
      boxRef.current.rotation.set(rotationX, rotationY, 0);

      if (accelerometerData.magnitude < 600) {
        boxRef.current.position.y -= 0.01; // Falling motion
      } else if (accelerometerData.magnitude >= 600 && accelerometerData.magnitude <= 1400) {
        boxRef.current.position.x += accelerometerData.x * 0.01; // Movement
        boxRef.current.position.y += accelerometerData.y * 0.01;
        boxRef.current.position.z += accelerometerData.z * 0.01;
      }

      // Shock Event Visualization
      if (accelerometerData.isSignificantShock) {
        // Normalize accelerometer values to 1G
        const normalizedX = accelerometerData.x / accelerometerData.magnitude;
        const normalizedY = accelerometerData.y / accelerometerData.magnitude;
        const normalizedZ = accelerometerData.z / accelerometerData.magnitude;

        // Calculate the shock direction
        const shockDirection = new Vector3(normalizedX, normalizedY, normalizedZ);
        boxRef.current.position.add(shockDirection.multiplyScalar(0.1)); // Adjust the scalar as needed for visualization
      }
    }
  }, [accelerometerData]);

  return (
    <mesh ref={boxRef}>
      <primitive object={gltf.scene} />
      {/* Add the credit card tracker on top of the box */}
      <mesh>
        <planeGeometry args={[0.15, 0.08]} />
        <meshStandardMaterial map={trackerTexture} />
      </mesh>
    </mesh>
  );
};

const BoxVisualization: React.FC<BoxVisualizationProps> = (props) => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <BoxModel {...props} />
      <OrbitControls />
    </Canvas>
  );
};

export default BoxVisualization;
