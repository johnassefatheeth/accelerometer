import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';

type BoxVisualizationProps = {
  accelerometerData: {
    x: number;
    y: number;
    z: number;
    magnitude: number;
  };
};

export function Model({ accelerometerData }: BoxVisualizationProps) {
  const { nodes, materials } = useGLTF('/cardboard_box.glb');
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
    <group ref={boxRef} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.CardboardBox_LP_lambert1_0.geometry}
        material={materials.lambert1}
        scale={0.01}
      />
    </group>
  );
}

useGLTF.preload('/cardboard_box.glb');

const BoxVisualization: React.FC<BoxVisualizationProps> = (props) => {
  return (
    <Canvas className=' h-[300px] ' camera={{ position: [0, 0, 1] }}>
      <ambientLight intensity={1.5} />
      <Model {...props} />
      <OrbitControls />
    </Canvas>
  );
};

export default BoxVisualization;
