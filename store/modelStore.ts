import { create } from 'zustand'
import * as THREE from 'three'

interface ModelState {
  modelUrl: string
  rotation: { x: number; y: number; z: number }
  position: { x: number; y: number; z: number }
  scale: number
  defaultScale: number
  animationSpeed: number
  isPaused: boolean
  currentAnimation: number
  cameraPosition: { x: number; y: number; z: number }
  needsReset: boolean
  setModelUrl: (url: string) => void
  setRotation: (axis: 'x' | 'y' | 'z', value: number) => void
  setPosition: (axis: 'x' | 'y' | 'z', value: number) => void
  setScale: (value: number) => void
  setDefaultScale: (value: number) => void
  setAnimationSpeed: (value: number) => void
  setIsPaused: (value: boolean) => void
  setCurrentAnimation: (index: number) => void
  setCameraPreset: (preset: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom') => void
  resetModel: () => void
  clearNeedsReset: () => void
}

export const useModelStore = create<ModelState>((set) => ({
  modelUrl: 'girl.glb',
  rotation: { x: 0, y: 0, z: 0 },
  position: { x: 0, y: -2.5, z: 0 },
  scale: 1,
  defaultScale: 1,
  animationSpeed: 1,
  isPaused: false,
  currentAnimation: 0,
  cameraPosition: { x: 0, y: 0, z: 10 },
  needsReset: false,

  setModelUrl: (url) => set({ 
    modelUrl: url,
    rotation: { x: 0, y: 0, z: 0 },
    position: { x: 0, y: -2.5, z: 0 },
    scale: url === 'girl.glb' ? 1 : undefined,
    currentAnimation: 0,
    needsReset: true,
  }),

  clearNeedsReset: () => set({ needsReset: false }),

  setDefaultScale: (value) => set((state) => ({ 
    defaultScale: value, 
    scale: state.modelUrl === 'girl.glb' ? 1 : value 
  })),

  setRotation: (axis, value) =>
    set((state) => ({
      rotation: { ...state.rotation, [axis]: value },
    })),

  setPosition: (axis, value) =>
    set((state) => ({
      position: { ...state.position, [axis]: value },
    })),

  setScale: (value) => set({ scale: value }),

  setAnimationSpeed: (value) => set({ animationSpeed: value }),

  setIsPaused: (value) => set({ isPaused: value }),

  setCurrentAnimation: (index) => set({ currentAnimation: index }),

  setCameraPreset: (preset) => {
    const presets = {
      front: { x: 0, y: 0, z: 10 },
      back: { x: 0, y: 0, z: -10 },
      left: { x: -10, y: 0, z: 0 },
      right: { x: 10, y: 0, z: 0 },
      top: { x: 0, y: 10, z: 0 },
      bottom: { x: 0, y: -10, z: 0 },
    }
    set({ cameraPosition: presets[preset] })
  },

  resetModel: () =>
    set({
      rotation: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: -2.5, z: 0 },
      scale: 1,
      animationSpeed: 1,
      isPaused: false,
    }),
})); 