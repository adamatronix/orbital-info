import React, { useCallback, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE  from 'three';

interface OrbitProps {
  children?:React.ReactNode
  rotation?:number[]
}

export const Orbit = ({
  children,
  rotation,
  ...props
}: OrbitProps) => {
  const [ orbitRef, setOrbitRef] = useState(null)
  const path = new THREE.Path().absarc(0, 0, 2, 0, Math.PI * 2);

  useFrame(({clock}) => {

    if(orbitRef) {
      const time = clock.getElapsedTime() / 20;
      const x = rotation[0] + time;
      const y = rotation[1] + time;
      const z = rotation[2] + time;
      // This function runs at the native refresh rate inside of a shared render-loop
      /*orbitRef.rotation.y = y;
      orbitRef.rotation.x = x;*/
      orbitRef.rotation.z = z;
    }
    
  })


  const circGeom = useCallback((node:THREE.BufferGeometry) => {
    if(node !== null) {
      const points = path.getPoints(100);
      node.setFromPoints(points)
    }
    
  },[path])

  const lineGeom = useCallback((node:any) => {
    if(node !== null) {
      node.computeLineDistances();

      setOrbitRef(node);

      if(rotation) {
        node.rotation.x = rotation[0];
        node.rotation.y = rotation[1];
        node.rotation.z = rotation[2];
      }
      
    }
  },[rotation])

  return (
    <line ref={lineGeom} {...props}>
      <bufferGeometry attach="geometry" ref={circGeom}/>
      <lineDashedMaterial attach="material" color="black" transparent opacity={0.5} dashSize={0.02} gapSize={0.03} linewidth={1}/>
      { children || null}
    </line>
  );
};
