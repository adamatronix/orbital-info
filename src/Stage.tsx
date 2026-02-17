import { Orbit } from './Orbit';
import styled from 'styled-components';
import { useGesture } from '@use-gesture/react';
import React, { useRef } from 'react';
import { Label } from './Label';
import { OrthographicCamera } from '@react-three/drei';
import { Canvas, useFrame} from '@react-three/fiber';
import * as THREE  from 'three';

export interface LabelConfig {
  label: string;
  pos: number;
  color?: string;
}

export interface OrbitConfig {
  rotation: [number, number, number];
  labels: LabelConfig[];
}

const DEFAULT_ORBITS: OrbitConfig[] = [
  { rotation: [22.5, 0, 0], labels: [
    { label: "Microsoft", pos: 0.5, color: "#FFC1DD" },
    { label: "Rewind", pos: 0.1, color: "#A7B7FF" },
  ]},
  { rotation: [0, 120, 0], labels: [
    { label: "Rabbit", pos: 0.2, color: "#BBFFF7" },
    { label: "Apple", pos: 0.8, color: "#BDA0FF" },
  ]},
  { rotation: [0, 240, 0], labels: [
    { label: "World Coin", pos: 0.4, color: "#AAEBFF" },
  ]},
  { rotation: [90, 0, 0], labels: [
    { label: "Oura", pos: 0.6, color: "#FAC1FF" },
    { label: "Meta", pos: 0.9, color: "#C977FF" },
  ]},
];

interface StageProps {
  orbits?: OrbitConfig[];
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`
export const Stage = ({
  orbits = DEFAULT_ORBITS,
  ...props
}: StageProps) => {
  const targetRef = useRef(null);

  return (
    <Wrapper ref={targetRef} {...props}>
      <CanvasComp targetRef={targetRef} orbits={orbits} />
    </Wrapper>
  );
};


interface CanvasCompProps {
  targetRef: React.RefObject<HTMLElement | null>;
  orbits: OrbitConfig[];
}
const CanvasComp = React.memo(({
  targetRef,
  orbits,
}: CanvasCompProps) => {
  return (
    <Canvas shadows>
        <color attach="background" args={['#fff']} />
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <sphereGeometry args={[2, 64, 64]} attach="geometry" />
          <meshStandardMaterial color="black" opacity={0.02} transparent depthWrite={false}/>
        </mesh>
        <OrbitOutside targetRef={targetRef}>
          <Orbits orbits={orbits} />
        </OrbitOutside>
        <OrthographicCamera makeDefault manual top={2.2} bottom={-2.2} left={-2.2} right={2.2} zoom={1} near={0} far={3000} position={[0,0,10]}/>
      </Canvas>
  )
})


interface OrbitOutsideProps {
  children: React.ReactNode;
  targetRef: React.RefObject<HTMLElement | null>;
}

const OrbitOutside = ({
  children,
  targetRef,
}: OrbitOutsideProps) => {
  const lastPosition = useRef([0,0]);
  const positions = useRef([0,0]);
  const orbitGroup = useRef<THREE.Group>(null!);

  useFrame(() => {
    orbitGroup.current.rotation.y = THREE.MathUtils.lerp(orbitGroup.current.rotation.y, positions.current[0] / 50, 0.1)
    orbitGroup.current.rotation.x = THREE.MathUtils.lerp(orbitGroup.current.rotation.x, positions.current[1] / 50, 0.1)
  })


  useGesture(
    {
      onDrag: ({ down, movement: pos }) => {
        positions.current = [lastPosition.current[0] + (-1 * pos[0]), lastPosition.current[1] + (-1 * pos[1])];

        if (!down) {
          lastPosition.current = positions.current;
        }
      },
    },
    { target: targetRef }
  )
  
  return (
    <group ref={orbitGroup}>
      {children}
    </group>
  )
}

interface OrbitsProps {
  orbits: OrbitConfig[];
}

const Orbits = ({ orbits }: OrbitsProps) => {
  const path = new THREE.Path().absarc(0, 0, 2, 0, Math.PI * 2);
  const orbitGroup = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (orbitGroup.current) {
      const targetTime = clock.getElapsedTime() / 5;
      const targetTimeZ = clock.getElapsedTime() / 25;
      const lerpFactor = 0.1;
      orbitGroup.current.rotation.x = THREE.MathUtils.lerp(
        orbitGroup.current.rotation.x,
        targetTime,
        lerpFactor
      );
      orbitGroup.current.rotation.y = THREE.MathUtils.lerp(
        orbitGroup.current.rotation.y,
        targetTime,
        lerpFactor
      );
      orbitGroup.current.rotation.z = THREE.MathUtils.lerp(
        orbitGroup.current.rotation.z,
        targetTimeZ,
        lerpFactor
      );
    }
  });

  return (
    <group ref={orbitGroup}>
      {orbits.map((orbitConfig, orbitIndex) => (
        <Orbit
          key={orbitIndex}
          rotation={orbitConfig.rotation.map((deg) =>
            THREE.MathUtils.degToRad(deg)
          ) as [number, number, number]}
        >
          {orbitConfig.labels.map((labelConfig, labelIndex) => (
            <Label
              key={`${orbitIndex}-${labelIndex}`}
              path={path}
              label={labelConfig.label}
              pos={labelConfig.pos}
              color={labelConfig.color}
            />
          ))}
        </Orbit>
      ))}
    </group>
  );
};