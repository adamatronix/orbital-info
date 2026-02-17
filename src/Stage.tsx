import { Orbit } from './Orbit';
import styled from 'styled-components';
import { useGesture } from '@use-gesture/react'
import React, { useState, useCallback, useRef } from 'react';
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
  const targetRef = useRef(null)
  const [ labelsArray, setLabelArray] = useState([])

  return (
    <Wrapper ref={targetRef} {...props}>
      <Labels labelsArray={labelsArray}/>
      <CanvasComp target={targetRef.current} setLabelsArray={setLabelArray} orbits={orbits}/>
    </Wrapper>
  );
};


interface CanvasCompProps {
  setLabelsArray: (a:any) => void
  target: any
  orbits: OrbitConfig[]
}
const CanvasComp = React.memo(({
  target,
  setLabelsArray,
  orbits
}:CanvasCompProps) => {

  return (
    <Canvas shadows>
        <color attach="background" args={['#fff']} />
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <sphereGeometry args={[2, 64, 64]} attach="geometry" />
          <meshStandardMaterial color="black" opacity={0.02} transparent depthWrite={false}/>
        </mesh>
        <OrbitOutside target={target}>
          <Orbits setLabelsArray={setLabelsArray} orbits={orbits}/> 
        </OrbitOutside>
        <OrthographicCamera makeDefault manual top={2.2} bottom={-2.2} left={-2.2} right={2.2} zoom={1} near={0} far={3000} position={[0,0,10]}/>
      </Canvas>
  )
})


const LabelsWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`

const LabelText = styled.div`
  display: block;
  position: absolute;
  will-change: transform;
`

const LabelTextInner = styled.div`
  position: relative;
  transform: translate(-50%, -150%);
  color: black;
  background: #eee;
  border-radius: 100px;
  font-size: 12px;
  padding: 3px 8px;
`

interface LabelsProps {
  labelsArray:any
}

const Labels = React.memo(({labelsArray}:LabelsProps) => {

  return (
    <LabelsWrapper>
      { labelsArray && labelsArray.map((label,i) => {
        return <LabelText key={i} style={label.position ?{ transform: `translate3d(${label.position.x}px, ${label.position.y}px, 0)`} : {}}>
          <LabelTextInner style={label.color ? {background: label.color} : {}}>{label.label}</LabelTextInner>
        </LabelText>
      })}

    </LabelsWrapper>
  )
})


interface OrbitOutsideProps {
  children: React.ReactNode,
  target: any
}

const OrbitOutside = ({
  children,
  target
}:OrbitOutsideProps) => {
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

        if(!down) {
          lastPosition.current = positions.current;
          console.log('down')
        }
      },
    }, 
    {
      target: target
    }
  )
  
  return (
    <group ref={orbitGroup}>
      {children}
    </group>
  )
}

interface OrbitsProps {
  setLabelsArray: (a:any) => void
  orbits: OrbitConfig[]
}

const Orbits = ({setLabelsArray, orbits}:OrbitsProps) => {
  const path = new THREE.Path().absarc(0, 0, 2, 0, Math.PI * 2);
  const orbitGroup = useRef<THREE.Group>(null!);

  useFrame(({camera,gl,clock}) => {
    setLabelsArray( oldArray => {
      const newArray = [];
      oldArray.forEach((labelObj:any) => {
        labelObj.position = toScreenPosition(labelObj.node,camera,gl);
        newArray.push(labelObj)
      })
      return newArray
    })

    if(orbitGroup.current) {
      const time = clock.getElapsedTime() / 5;
      const x = time;
      const y = time;
      const z = time;
      orbitGroup.current.rotation.x = x;
      orbitGroup.current.rotation.y = y;
      orbitGroup.current.rotation.z = z;
    }
  })

  const output = useCallback((label:string,node:THREE.Group,color?:string) => {
    setLabelsArray(oldArray => {

      const doesExist = oldArray.filter(obj => {
        return obj.label === label
      })

      if(doesExist && doesExist.length > 0) {
        return oldArray;
      }

      return [...oldArray, { label: label, node: node, color: color}]
    })
  },[setLabelsArray])

  return (
    <group ref={orbitGroup}>
      {orbits.map((orbitConfig, orbitIndex) => (
        <Orbit
          key={orbitIndex}
          rotation={orbitConfig.rotation.map((deg) => THREE.MathUtils.degToRad(deg)) as [number, number, number]}
        >
          {orbitConfig.labels.map((labelConfig, labelIndex) => (
            <Label
              key={`${orbitIndex}-${labelIndex}`}
              path={path}
              label={labelConfig.label}
              pos={labelConfig.pos}
              color={labelConfig.color}
              output={output}
            />
          ))}
        </Orbit>
      ))}
    </group>
  )
}

function toScreenPosition(obj, camera, renderer)
{
    const vector = new THREE.Vector3();

    const widthHalf = 0.5*renderer.domElement.offsetWidth;
    const heightHalf = 0.5*renderer.domElement.offsetHeight;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
        x: vector.x,
        y: vector.y
    };

};