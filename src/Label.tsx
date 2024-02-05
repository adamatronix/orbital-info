import { useCallback } from 'react';
import * as THREE  from 'three';

interface LabelProps {
  path:THREE.Path
  label?:string
  pos:number
}

export const Label = ({
  path,
  pos,
  ...props
}: LabelProps) => {
  const ref = useCallback((node:any) => {
    if(node !== null) {
      const newPos = path.getPoint(pos); 
      const vec = new THREE.Vector3(newPos.x,newPos.y,0); 
      node.position.copy(vec);

    }
  },[path,pos])

  const texture = new THREE.Texture( generateDotTexture() );
  texture.needsUpdate = true;

  return (
    <group ref={ref}>
      <sprite visible scale={[0.01,0.01,0.01]} {...props}>
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

  context.font = "48px serif";
  context.fillText("QPOCdsfdsfdsfdsfdsfdsf", 10, 50);

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