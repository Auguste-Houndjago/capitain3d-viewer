"use client"

import { useRef, useEffect, useState } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, OrbitControls } from "@react-three/drei"
import * as THREE from "three"

interface CameraSetupProps {
  cameraPosition: [number, number, number]
  firstPersonMode: boolean
  controlsEnabled: boolean
}

export default function CameraSetup({ cameraPosition, firstPersonMode, controlsEnabled }: CameraSetupProps) {
  const { camera, gl } = useThree()
  const orbitControlsRef = useRef<any>(null)
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera>(null)
  const [initialPosition] = useState(cameraPosition)

  // Référence pour la position de la caméra en mode première personne
  const fpPosition = useRef({
    position: new THREE.Vector3(...cameraPosition),
    target: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
    moveSpeed: 0.1,
    rotationSpeed: 0.02,
  })

  // Touches pressées
  const keysPressed = useRef<{ [key: string]: boolean }>({})

  // Gestionnaire d'événements pour les touches
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false
    }

    if (firstPersonMode) {
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [firstPersonMode])

  // Mise à jour de la position de la caméra en fonction du mode
  useEffect(() => {
    if (perspectiveCameraRef.current) {
      perspectiveCameraRef.current.position.set(...cameraPosition)

      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.set(0, 0, 0)
        orbitControlsRef.current.update()
      }
    }
  }, [cameraPosition])

  // Activer/désactiver les contrôles en fonction du mode
  useEffect(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = controlsEnabled && !firstPersonMode
    }
  }, [controlsEnabled, firstPersonMode])

  // Logique de déplacement en première personne
  useFrame(() => {
    if (firstPersonMode && perspectiveCameraRef.current) {
      const camera = perspectiveCameraRef.current
      const direction = new THREE.Vector3()
      const sideDirection = new THREE.Vector3()

      // Calculer la direction avant/arrière
      camera.getWorldDirection(direction)
      direction.normalize()

      // Calculer la direction gauche/droite
      sideDirection.crossVectors(camera.up, direction).normalize()

      // Appliquer les mouvements en fonction des touches pressées
      if (keysPressed.current["w"]) {
        camera.position.addScaledVector(direction, fpPosition.current.moveSpeed)
      }
      if (keysPressed.current["s"]) {
        camera.position.addScaledVector(direction, -fpPosition.current.moveSpeed)
      }
      if (keysPressed.current["a"]) {
        camera.position.addScaledVector(sideDirection, fpPosition.current.moveSpeed)
      }
      if (keysPressed.current["d"]) {
        camera.position.addScaledVector(sideDirection, -fpPosition.current.moveSpeed)
      }
      if (keysPressed.current["q"]) {
        camera.position.y += fpPosition.current.moveSpeed
      }
      if (keysPressed.current["e"]) {
        camera.position.y -= fpPosition.current.moveSpeed
      }

      // Rotation avec les flèches
      if (keysPressed.current["arrowleft"]) {
        camera.rotateY(fpPosition.current.rotationSpeed)
      }
      if (keysPressed.current["arrowright"]) {
        camera.rotateY(-fpPosition.current.rotationSpeed)
      }
      if (keysPressed.current["arrowup"]) {
        camera.rotateX(fpPosition.current.rotationSpeed)
      }
      if (keysPressed.current["arrowdown"]) {
        camera.rotateX(-fpPosition.current.rotationSpeed)
      }
    }
  })

  return (
    <>
{firstPersonMode && (
    <PerspectiveCamera
      ref={perspectiveCameraRef}
      makeDefault
      position={initialPosition}
      fov={75}
      near={0.1}
      far={1000}
    />
  )}

  <OrbitControls
    ref={orbitControlsRef}
    enablePan={controlsEnabled && !firstPersonMode}
    enableZoom={controlsEnabled && !firstPersonMode}
    enableRotate={controlsEnabled && !firstPersonMode}
    minDistance={2}
    maxDistance={20}
  />
    </>
  )
}
