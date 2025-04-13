
import { Html } from "@react-three/drei";
import * as THREE from "three";
import React from "react";

// AnimationSelector composant
interface AnimationSelectorProps {
  animations: THREE.AnimationClip[];
  onSelect: (index: number) => void;
}


const AnimationSelector: React.FC<AnimationSelectorProps> = ({ animations, onSelect }) => {
  return (
    <Html position={[0, 0, 0]} transform>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1,
          color: "white",
          pointerEvents: "auto", // Nécessaire pour que les événements de souris fonctionnent
        }}
      >
        <h3>Select an Animation</h3>
        <ul>
          {animations.map((animation, index) => (
            <li key={animation.uuid}>
              <button onClick={() => onSelect(index)}>{animation.name}</button>
            </li>
          ))}
        </ul>
      </div>
    </Html>
  );
};


export default AnimationSelector ;