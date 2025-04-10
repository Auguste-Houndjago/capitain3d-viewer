"use client"

import { useGLTF, useAnimations } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useModelStore } from "@/store/modelStore"

type ModelProps = {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  animationIndex: number
  animationSpeed: number
  isPaused: boolean
  onModelLoaded?: (info: {
    name: string
    vertices: number
    triangles: number
    animations: THREE.AnimationClip[]
  }) => void
}

export default function Model({
  url,
  position,
  rotation,
  scale,
  animationIndex,
  animationSpeed,
  isPaused,
  onModelLoaded,
}: ModelProps) {
  const group = useRef<THREE.Group>(null)
  const setDefaultScale = useModelStore((state) => state.setDefaultScale)
  const needsReset = useModelStore((state) => state.needsReset)
  const clearNeedsReset = useModelStore((state) => state.clearNeedsReset)

  // Nettoyer l'ancien modèle
  useEffect(() => {
    if (needsReset) {
      // Nettoyer les ressources de l'ancien modèle
      if (group.current) {
        group.current.clear()
        // Disposer des géométries et matériaux
        group.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose()
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose())
            } else {
              child.material.dispose()
            }
          }
        })
      }
      clearNeedsReset()
    }
  }, [needsReset, clearNeedsReset])

  // Préchargement
  useEffect(() => {
    useGLTF.preload(url)
    return () => {
      const gltf = useGLTF(url)
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose())
          } else {
            child.material.dispose()
          }
        }
      })
    }
  }, [url])

  const { scene, animations } = useGLTF(url)
  const { actions, mixer } = useAnimations(animations, group)

  // Gérer le changement d'animation
  useEffect(() => {
    if (actions && animations && animations.length > 0) {
      // Arrêter toutes les animations en cours
      Object.values(actions).forEach(action => action?.stop())
      
      // Démarrer la nouvelle animation
      const currentAction = actions[animations[animationIndex]?.name]
      if (currentAction) {
        currentAction.reset().play()
        if (isPaused) {
          currentAction.paused = true
        }
      }
    }
  }, [actions, animations, animationIndex, isPaused])

  // Calculer l'échelle automatiquement
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene)
      const size = box.getSize(new THREE.Vector3())
      const maxDimension = Math.max(size.x, size.y, size.z)
      
      // On veut que la plus grande dimension soit d'environ 5 unités
      const targetSize = 5
      const newScale = targetSize / maxDimension
      
      setDefaultScale(newScale)
    }
  }, [scene, setDefaultScale])

  // Informer le parent des informations du modèle
  useEffect(() => {
    if (scene && onModelLoaded) {
      let vertexCount = 0
      let triangleCount = 0

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          vertexCount += child.geometry.attributes.position.count
          if (child.geometry.index) {
            triangleCount += child.geometry.index.count / 3
          }
        }
      })

      onModelLoaded({
        name: url.split('/').pop() || '',
        vertices: vertexCount,
        triangles: triangleCount,
        animations: animations,
      })
    }
  }, [scene, url, onModelLoaded, animations])

  useFrame(() => {
    if (mixer) {
      if (!isPaused) {
        mixer.update(0.016 * animationSpeed)
      }
    }
  })

  return <primitive ref={group} object={scene} position={position} rotation={rotation} scale={scale} />
}
