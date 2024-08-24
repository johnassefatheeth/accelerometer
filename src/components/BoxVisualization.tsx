import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader, Vector3, MathUtils } from 'three';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

type BoxVisualizationProps = {
  accelerometerData: {
    x: number;
    y: number;
    z: number;
    magnitude: number;
    isSignificantShock: boolean;
  };
};

const BoxModel: React.FC<BoxVisualizationProps> = ({ accelerometerData }) => {
  const gltf = useLoader(GLTFLoader, 'src/models/cardboard_box.glb');
  const trackerTexture = useLoader(TextureLoader, 'src/models/ccard.png');
  const boxRef = useRef<any>();

  const targetPosition = useRef(new Vector3(0, 0, 0));
  const targetRotation = useRef(new Vector3(0, 0, 0));
  const [isFalling, setIsFalling] = useState(false);

  useEffect(() => {
    if (!boxRef.current) return;

    const rotationX = Math.atan2(accelerometerData.y, accelerometerData.z);
    const rotationY = Math.atan2(accelerometerData.x, accelerometerData.z);

    targetRotation.current.set(rotationX, rotationY, 0);

    let newPosition = boxRef.current.position.clone();

    if (accelerometerData.magnitude < 600) {
      newPosition.y -= 0.01;
    } else if (accelerometerData.magnitude >= 600 && accelerometerData.magnitude <= 1400) {
      newPosition.x += accelerometerData.x * 0.01;
      newPosition.y += accelerometerData.y * 0.01;
      newPosition.z += accelerometerData.z * 0.01;
    }

    if (accelerometerData.isSignificantShock) {
      const normalizedX = accelerometerData.x / accelerometerData.magnitude;
      const normalizedY = accelerometerData.y / accelerometerData.magnitude;
      const normalizedZ = accelerometerData.z / accelerometerData.magnitude;

      const shockDirection = new Vector3(normalizedX, normalizedY, normalizedZ);
      newPosition.add(shockDirection.multiplyScalar(0.1));
    }

    targetPosition.current.copy(newPosition);
  }, [accelerometerData]);

  useFrame(({ camera, scene }) => {
    if (!boxRef.current) return;

    boxRef.current.position.lerp(targetPosition.current, 0.1);
    boxRef.current.rotation.x = MathUtils.lerp(boxRef.current.rotation.x, targetRotation.current.x, 0.1);
    boxRef.current.rotation.y = MathUtils.lerp(boxRef.current.rotation.y, targetRotation.current.y, 0.1);
    boxRef.current.rotation.z = MathUtils.lerp(boxRef.current.rotation.z, targetRotation.current.z, 0.1);

    const boxPosition = boxRef.current.position;

    const cameraDistance = 1;
    camera.position.lerp(
      new Vector3(boxPosition.x, boxPosition.y + cameraDistance, boxPosition.z + cameraDistance),
      0.05
    );
    camera.lookAt(boxPosition);

   

  });

  return (
    <group ref={boxRef}>
      <primitive object={gltf.scene} />
      <mesh position={[0.2, 0.173, 0.31]} scale={[1.2, 2, 2]}>
        <planeGeometry args={[0.15, 0.08]} />
        <meshStandardMaterial map={trackerTexture} transparent={true} />
      </mesh>
    </group>
  );
};

const BoxVisualization: React.FC<BoxVisualizationProps> = (props) => {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <BoxModel {...props} />
      <OrbitControls />
      
    </Canvas>
  );
};

export default BoxVisualization;
