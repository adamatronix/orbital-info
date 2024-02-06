import React, { useCallback } from 'react';
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
  const path = new THREE.Path().absarc(0, 0, 2, 0, Math.PI * 2);

  const circGeom = useCallback((node:THREE.BufferGeometry) => {
    if(node !== null) {
      const points = path.getPoints(100);
      node.setFromPoints(points)
    }
    
  },[path])

  const lineGeom = useCallback((node:any) => {
    if(node !== null) {
      node.computeLineDistances();

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
      <lineDashedMaterial attach="material" color="black" transparent opacity={1} dashSize={0.03} gapSize={0.03} linewidth={1}/>
      { children || null}
    </line>
  );
};
