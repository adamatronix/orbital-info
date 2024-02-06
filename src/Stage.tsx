import { Orbit } from './Orbit';
import styled from 'styled-components';
import React, { useState, useCallback } from 'react';
import { Label } from './Label';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE  from 'three';

interface StageProps {

}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`



export const Stage = ({
  ...props
}: StageProps) => {
  const [ labelsArray, setLabelArray] = useState([])
  return (
    <Wrapper {...props}>
      <Labels labelsArray={labelsArray}/>
      <CanvasComp setLabelsArray={setLabelArray}/>
    </Wrapper>
  );
};


interface CanvasCompProps {
  setLabelsArray: (a:any) => void
}
const CanvasComp = React.memo(({
  setLabelsArray
}:CanvasCompProps) => {
  return (
    <Canvas shadows camera={{ position: [0, 0, 3.5] }}>
        <color attach="background" args={['#fff']} />
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <sphereGeometry args={[2, 64, 64]} attach="geometry" />
          <meshStandardMaterial color="black" opacity={0.02} transparent depthWrite={false}/>
        </mesh>
        <Orbits setLabelsArray={setLabelsArray}/>
        <OrbitControls enablePan={false} enableZoom={false}/>
        <OrthographicCamera makeDefault top={2.2} bottom={-2.2} left={-2.2} right={2.2} zoom={1} near={0} far={3000} position={[0,0,10]}/>
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
  transition: transform .2s easeInOut;
  will-change: transform;
`

const LabelTextInner = styled.div`
  position: relative;
  transform: translate(-50%, -150%);
  color: black;
  background: #eee;
  border-radius: 4px;
  font-size: 12px;
  padding: 2px 6px;
`

interface LabelsProps {
  labelsArray:any
}

const Labels = React.memo(({labelsArray}:LabelsProps) => {

  return (
    <LabelsWrapper>
      { labelsArray && labelsArray.map((label,i) => {
        return <LabelText key={i} style={label.position ?{ transform: `translate3d(${label.position.x}px, ${label.position.y}px, 0)`} : {}}>
          <LabelTextInner>{label.label}</LabelTextInner>
        </LabelText>
      })}

    </LabelsWrapper>
  )
})

interface OrbitsProps {
  setLabelsArray: (a:any) => void
}

const Orbits = ({setLabelsArray}:OrbitsProps) => {
  const path = new THREE.Path().absarc(0, 0, 2, 0, Math.PI * 2);

  useFrame(({camera,gl}) => {
    setLabelsArray( oldArray => {
      const newArray = [];
      oldArray.forEach((labelObj:any) => {
        labelObj.position = toScreenPosition(labelObj.node,camera,gl);
        newArray.push(labelObj)
      })
      return newArray
    })
  })

  const output = useCallback((label:string,node:THREE.Group) => {
    setLabelsArray(oldArray => {

      const doesExist = oldArray.filter(obj => {
        return obj.label === label
      })

      if(doesExist && doesExist.length > 0) {
        return oldArray;
      }

      return [...oldArray, { label: label, node: node}]
    })
  },[setLabelsArray])

  return (
    <>
      <Orbit>
        <Label path={path} label="QPOC" pos={0.5} output={output}/>
        <Label path={path} label="FEMINISM" pos={0.1} output={output}/>
      </Orbit>
      <Orbit rotation={[Math.PI / 4,Math.PI / 4,0]}>
        <Label path={path} label="ICE SPICE" pos={0.2} output={output}/>
        <Label path={path} label="DOWNSYDROME" pos={0.8} output={output}/>
      </Orbit>
      <Orbit rotation={[-Math.PI / 4, -Math.PI / 2 ,0]}>
        <Label path={path} label="POOP" pos={0.4} output={output}/>
        <Label path={path} label="BUTT" pos={0.9} output={output}/>
      </Orbit>
    </>
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