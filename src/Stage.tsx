import { Orbit } from './Orbit';
import styled from 'styled-components';
import { Label } from './Label';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
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


  const path = new THREE.Path().absarc(0, 0, 2, 0, Math.PI * 2);

  return (
    <Wrapper>
      <Canvas shadows camera={{ position: [0, 0, 3.5] }} {...props}>
        <color attach="background" args={['#fff']} />
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <sphereGeometry args={[2, 64, 64]} attach="geometry" />
          <meshStandardMaterial color="black" opacity={0.02} transparent depthWrite={false}/>
        </mesh>
        <Orbit>
          <Label path={path} label="QPOC" pos={0.5}/>
          <Label path={path} label="FEMINISM" pos={0.1}/>
        </Orbit>
        <Orbit rotation={[Math.PI / 4,Math.PI / 4,0]}>
          <Label path={path} label="POOP" pos={0.2}/>
          <Label path={path} label="BUTT" pos={0.8}/>
        </Orbit>
        <Orbit rotation={[-Math.PI / 4, -Math.PI / 2 ,0]}>
          <Label path={path} label="POOP" pos={0.4}/>
          <Label path={path} label="BUTT" pos={0.9}/>
        </Orbit>
        <OrbitControls enablePan={false}/>
        <OrthographicCamera makeDefault top={2.2} bottom={-2.2} left={-2.2} right={2.2} zoom={1} near={0} far={3000} position={[0,0,10]}/>
      </Canvas>
    </Wrapper>
  );
};