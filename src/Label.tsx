import { useCallback, useState, useRef } from 'react';
import * as THREE  from 'three';
import { useFrame} from '@react-three/fiber';

interface LabelProps {
  path:THREE.Path
  output?: (label:string,node:THREE.Group) => void
  label?:string
  pos:number
}

export const Label = ({
  path,
  output,
  label,
  pos,
  ...props
}: LabelProps) => {
  const initPos = useRef<number>(pos);
  const pointScale = useRef<number>(pos);
  const totalElapsed = useRef<number>(0);
  const speed = THREE.MathUtils.randInt(50,100);
  const [ labelRef, setLabelRef ] = useState(null!);
  useFrame(({clock}) => {
    if(labelRef) {
      const time = (clock.getElapsedTime() - totalElapsed.current) / speed;
      if(pointScale.current > 1) {
        totalElapsed.current = clock.getElapsedTime();
        pointScale.current = 0;
        initPos.current = 0;
      } else if ( pointScale.current < 0) {
        pointScale.current = 1;
        initPos.current = 1;
      } else {
        pointScale.current = initPos.current + time;
      }
      const newPos = path.getPoint(pointScale.current); 
      const vec = new THREE.Vector3(newPos.x,newPos.y,0); 
      labelRef.position.copy(vec);
    }

  })

  const ref = useCallback((node:any) => {
    if(node !== null) {
      setLabelRef(node);
      const newPos = path.getPoint(pos); 
      const vec = new THREE.Vector3(newPos.x,newPos.y,0); 
      node.position.copy(vec);

      if(output) {
        output(label,node);
      }
    }
  },[path,pos,label,output])

  const texture = new THREE.Texture( generateDotTexture() );
  texture.needsUpdate = true;

  return (
    <group ref={ref}>
      <sprite visible scale={[0.03,0.03,0.03]} {...props}>
        <spriteMaterial map={texture} sizeAttenuation={false} depthWrite={false} />
      </sprite>
    </group>
  );
};

function generateDotTexture() {
  const canvas = document.createElement( 'canvas' );
  canvas.width = 30;
  canvas.height = 30;

  const context = canvas.getContext( '2d' );

  context.beginPath();
  context.arc(canvas.width/2, canvas.height/2, 15, 0, 2 * Math.PI, false);
  context.fillStyle = 'black';
  context.fill();

  return canvas;
}

/*
function generateLabelTexture(label:string) {
  
  const canvas = document.createElement( 'canvas' );
  const context = canvas.getContext( '2d' );
  canvas.width = 1000;
  canvas.height = 1000;

  context.font = "30px HelveticaNeue";

  const measure = context.measureText(label);
  const width = measure.width;
  const height = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;

  const boxWidth = width + 10;
  const boxHeight = height + 10;

  
  context.textBaseline = 'top';
  
  context.fillStyle = 'white';
  context.roundRect((canvas.width / 2) - boxWidth / 2, (canvas.height / 2) - boxHeight / 2, boxWidth, boxHeight, 6);
  context.fill();
  context.fillStyle = '#000';
  context.fillText(label, (canvas.width / 2) - width / 2, (canvas.height / 2) - height / 2);


  return canvas;
}*/