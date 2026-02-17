import { useCallback, useState, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

interface LabelProps {
  path: THREE.Path;
  label?: string;
  color?: string;
  pos: number;
}

export const Label = ({
  path,
  label,
  color,
  pos,
  ...props
}: LabelProps) => {
  const initPos = useRef<number>(pos);
  const pointScale = useRef<number>(pos);
  const totalElapsed = useRef<number>(0);
  const speed = THREE.MathUtils.randInt(50, 100);
  const [labelRef, setLabelRef] = useState<THREE.Group | null>(null);

  useFrame(({ clock }) => {
    if (labelRef) {
      const time = (clock.getElapsedTime() - totalElapsed.current) / speed;
      if (pointScale.current > 1) {
        totalElapsed.current = clock.getElapsedTime();
        pointScale.current = 0;
        initPos.current = 0;
      } else if (pointScale.current < 0) {
        pointScale.current = 1;
        initPos.current = 1;
      } else {
        pointScale.current = initPos.current + time;
      }
      const newPos = path.getPoint(pointScale.current);

      if (newPos) {
        const vec = new THREE.Vector3(newPos.x, newPos.y, 0);
        labelRef.position.copy(vec);
      }
    }
  });

  const ref = useCallback(
    (node: THREE.Group | null) => {
      if (node !== null) {
        setLabelRef(node);
        const newPos = path.getPoint(pos);
        const vec = new THREE.Vector3(newPos.x, newPos.y, 0);
        node.position.copy(vec);
      }
    },
    [path, pos]
  );

  const texture = useMemo(() => {
    const tex = new THREE.Texture(generateDotTexture(color));
    tex.needsUpdate = true;
    return tex;
  }, [color]);

  return (
    <group ref={ref}>
      <sprite visible scale={[0.05, 0.05, 0.05]} {...props}>
        <spriteMaterial
          map={texture}
          sizeAttenuation={false}
          depthWrite={false}
        />
      </sprite>
      {label && (
        <Html
          center
          pointerEvents="none"
          wrapperClass="orbital-label"
          zIndexRange={[1, 1]}
        >
          <div
            style={{
              transform: 'translate(-50%, -100%)',
              background: color ?? '#eee',
              borderRadius: 100,
              fontSize: 12,
              padding: '3px 8px',
              whiteSpace: 'nowrap',
              color: 'black',
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};

function generateDotTexture(color?: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 30;
  canvas.height = 30;

  const context = canvas.getContext('2d')!;

  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, 15, 0, 2 * Math.PI, false);
  context.fillStyle = color || 'black';
  context.fill();

  return canvas;
}
