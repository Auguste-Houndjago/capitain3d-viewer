"use client"

import { Canvas, useThree } from "@react-three/fiber"
import { Suspense, useState, useCallback, useRef } from "react"
import { Environment, Stats, Grid } from "@react-three/drei"
import type * as THREE from "three"
import Model from "./Model"
import ModelControls from "./ModelControls"
import ModelUploader from "./ModelUploader"
import LoadingScreen from "./LoadingScreen"
import CameraSetup from "./CameraSetup"
import { useModelStore } from "@/store/modelStore"
import { Button } from "@/components/ui/button"
import { Settings, X } from "lucide-react"
import AudioControls from './AudioControls'

// Liste des environnements disponibles
const ENVIRONMENTS = ["forest", "apartment", "city", "dawn", "lobby", "night", "park", "studio", "sunset", "warehouse"]

// Composant pour capturer une image du canvas
function ScreenshotButton({ onCapture }: { onCapture: (dataUrl: string) => void }) {
  const { gl, scene, camera } = useThree()

  const takeScreenshot = useCallback(() => {
    // Rendre la scène
    gl.render(scene, camera)

    // Obtenir l'URL de données de l'image
    const dataUrl = gl.domElement.toDataURL("image/png")

    // Appeler le callback avec l'URL de données
    onCapture(dataUrl)
  }, [gl, scene, camera, onCapture])

  return null
}

export default function Scene() {
  const [environmentLight, setEnvironmentLight] = useState(false)
  const [currentEnvironment, setCurrentEnvironment] = useState("forest")
  const [modelInfo, setModelInfo] = useState<{
    name: string
    vertices: number
    triangles: number
  } | null>(null)
  const [animations, setAnimations] = useState<THREE.AnimationClip[]>([])
  const [started, setStarted] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [firstPersonMode, setFirstPersonMode] = useState(false)
  const [controlsEnabled, setControlsEnabled] = useState(true)
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(true)

  const { position, rotation, scale, animationSpeed, currentAnimation, isPaused, modelUrl } = useModelStore()

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const toggleLight = useCallback(() => {
    setEnvironmentLight((prev) => !prev)
  }, [])

  const handleModelLoaded = useCallback(
    (info: {
      name: string
      vertices: number
      triangles: number
      animations: THREE.AnimationClip[]
    }) => {
      setModelInfo({
        name: info.name,
        vertices: info.vertices,
        triangles: info.triangles,
      })
      setAnimations(info.animations)
    },
    [],
  )

  const handleEnvironmentChange = useCallback((env: string) => {
    setCurrentEnvironment(env)
    setEnvironmentLight(true)
  }, [])

  const toggleGrid = useCallback(() => {
    setShowGrid((prev) => !prev)
  }, [])

  const toggleCameraMode = useCallback(() => {
    setFirstPersonMode((prev) => !prev)
  }, [])

  const handleScreenshotCapture = useCallback((dataUrl: string) => {
    setScreenshotUrl(dataUrl)
  }, [])

  const downloadScreenshot = useCallback(() => {
    if (screenshotUrl) {
      const link = document.createElement("a")
      link.href = screenshotUrl
      link.download = `${modelInfo?.name || "model"}_screenshot.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [screenshotUrl, modelInfo])

  const takeScreenshot = useCallback(() => {
    // La capture sera effectuée par le composant ScreenshotButton
    // qui a accès au contexte Three.js
    const screenshotButton = document.createElement('button');
    screenshotButton.style.display = 'none';
    screenshotButton.onclick = () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        handleScreenshotCapture(dataUrl);
      }
    };
    document.body.appendChild(screenshotButton);
    screenshotButton.click();
    document.body.removeChild(screenshotButton);
  }, [handleScreenshotCapture]);

  const toggleControls = useCallback(() => {
    setShowControls(prev => !prev)
  }, [])

//c
  return (
    <div className="relative bg-black h-screen">
      <LoadingScreen started={started} onStarted={() => setStarted(true)} />

      {/* Bouton pour afficher/masquer les contrôles */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-20 bg-accent"
        onClick={toggleControls}
      >
        {showControls ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
      </Button>

      <Canvas ref={canvasRef} gl={{ antialias: true, preserveDrawingBuffer: true }} dpr={[1, 1.5]} className="h-screen">
        {/* Lumières */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 5]} intensity={1.2} castShadow />

        {/* Configuration de la caméra */}
        <CameraSetup
          cameraPosition={[0, 0, 10]}
          firstPersonMode={firstPersonMode}
          controlsEnabled={controlsEnabled}
        />

        {/* Environnement réaliste */}
        {environmentLight && (
          <Environment
            preset={currentEnvironment as any}
            background
            backgroundIntensity={0.15}
            environmentIntensity={0.5}
          />
        )}

        {/* Sol transparent */}
        {showGrid && (
          <Grid
            position={[0, -2.5, 0]}
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.6}
            cellColor="#6f6f6f"
            sectionSize={5}
            sectionThickness={1.2}
            sectionColor="#9d4b4b"
            fadeDistance={30}
            fadeStrength={1}
            infiniteGrid
          />
        )}

        {/* Modèle 3D */}
        <Suspense fallback={null}>
          <Model
            url={modelUrl}
            position={[position.x, position.y, position.z]}
            rotation={[rotation.x, rotation.y, rotation.z]}
            scale={scale}
            animationIndex={currentAnimation}
            animationSpeed={animationSpeed}
            isPaused={isPaused}
            onModelLoaded={handleModelLoaded}
          />
        </Suspense>

        {/* Statistiques de performance */}
        <Stats className="stats" />

        {/* Composant pour la capture d'écran */}
        <ScreenshotButton onCapture={handleScreenshotCapture} />
      </Canvas>

      {/* Panneau de contrôle */}
      <div className={`absolute top-8 right-4 z-10 ${!showControls ? 'hidden' : ''}`}>
        <ModelControls
          animations={animations}
          onSelectAnimation={useModelStore((state) => state.setCurrentAnimation)}
          onToggleLight={toggleLight}
          environmentLight={environmentLight}
          modelInfo={modelInfo || undefined}
          environments={ENVIRONMENTS}
          currentEnvironment={currentEnvironment}
          onEnvironmentChange={handleEnvironmentChange}
          showGrid={showGrid}
          onToggleGrid={toggleGrid}
          firstPersonMode={firstPersonMode}
          onToggleCameraMode={toggleCameraMode}
          onTakeScreenshot={takeScreenshot}
          screenshotUrl={screenshotUrl}
          onDownloadScreenshot={downloadScreenshot}
        />
      </div>

      {/* Uploader de modèle */}
      <ModelUploader />

      {firstPersonMode && (
        <div className="absolute bottom-4 left-4 z-10 bg-black/70 text-white p-3 rounded-md text-sm">
          <h3 className="font-bold mb-1">Mode Première Personne</h3>
          <p>Déplacement: W, A, S, D, Q, E</p>
          <p>Rotation: Flèches directionnelles</p>
        </div>
      )}

      <AudioControls />
    </div>
  )
}
