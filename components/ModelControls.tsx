"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  RotateCcw,
  ZoomIn,
  Move,
  Play,
  Pause,
  RefreshCw,
  Camera,
  Sun,
  Info,
  MinusCircle,
  PlusCircle,
  Grid,
  User,
  Download,
  CameraIcon,
} from "lucide-react"
import type * as THREE from "three"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useModelStore } from "@/store/modelStore"

interface ModelControlsProps {
  animations: THREE.AnimationClip[]
  onSelectAnimation: (index: number) => void
  onToggleLight: () => void
  environmentLight: boolean
  modelInfo?: {
    name: string
    vertices: number
    triangles: number
  }
  environments: string[]
  currentEnvironment: string
  onEnvironmentChange: (env: string) => void
  showGrid: boolean
  onToggleGrid: () => void
  firstPersonMode: boolean
  onToggleCameraMode: () => void
  onTakeScreenshot: () => void
  screenshotUrl: string | null
  onDownloadScreenshot: () => void
}

export default function ModelControls({
  animations,
  onSelectAnimation,
  onToggleLight,
  environmentLight,
  modelInfo,
  environments,
  currentEnvironment,
  onEnvironmentChange,
  showGrid,
  onToggleGrid,
  firstPersonMode,
  onToggleCameraMode,
  onTakeScreenshot,
  screenshotUrl,
  onDownloadScreenshot,
}: ModelControlsProps) {
  const {
    rotation,
    position,
    scale,
    animationSpeed,
    setRotation,
    setPosition,
    setScale,
    setAnimationSpeed,
    setIsPaused,
    resetModel
  } = useModelStore()

  const isPaused = useModelStore((state) => state.isPaused)

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setRotation(axis, value)
  }

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setPosition(axis, value)
  }

  const handleSpeedChange = (value: number[]) => {
    setAnimationSpeed(value[0])
  }

  const handlePlayPause = () => {
    setIsPaused(!isPaused)
  }

  return (
    <Card className="w-80 bg-white/90 backdrop-blur-sm shadow-xl border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Contrôles du Modèle 3D</span>
          <Button variant="ghost" size="icon" onClick={resetModel}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="animations">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="animations">
              <Play className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="rotation">
              <RotateCcw className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="position">
              <Move className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="scale">
              <ZoomIn className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="camera">
              <Camera className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="environment">
              <Sun className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="animations" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Vitesse d'animation</Label>
                <span className="text-xs text-gray-500">{animationSpeed.toFixed(1)}x</span>
              </div>
              <Slider defaultValue={[1]} min={0.1} max={2} step={0.1} onValueChange={handleSpeedChange} />
            </div>

            <div className="space-y-2">
              <Label>Animations disponibles</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {animations.map((animation, index) => (
                  <Button
                    key={animation.uuid}
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs truncate"
                    onClick={() => onSelectAnimation(index)}
                  >
                    {animation.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button variant="outline" size="icon" onClick={handlePlayPause}>
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="rotation" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Rotation X</Label>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRotationChange("x", rotation.x - 0.1)}
                  >
                    <MinusCircle className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRotationChange("x", rotation.x + 0.1)}
                  >
                    <PlusCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[rotation.x]}
                min={-Math.PI}
                max={Math.PI}
                step={0.01}
                onValueChange={(value) => handleRotationChange("x", value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Rotation Y</Label>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRotationChange("y", rotation.y - 0.1)}
                  >
                    <MinusCircle className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRotationChange("y", rotation.y + 0.1)}
                  >
                    <PlusCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[rotation.y]}
                min={-Math.PI}
                max={Math.PI}
                step={0.01}
                onValueChange={(value) => handleRotationChange("y", value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Rotation Z</Label>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRotationChange("z", rotation.z - 0.1)}
                  >
                    <MinusCircle className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRotationChange("z", rotation.z + 0.1)}
                  >
                    <PlusCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[rotation.z]}
                min={-Math.PI}
                max={Math.PI}
                step={0.01}
                onValueChange={(value) => handleRotationChange("z", value[0])}
              />
            </div>
          </TabsContent>

          <TabsContent value="position" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Position X</Label>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handlePositionChange("x", position.x - 0.5)}
                  >
                    <MinusCircle className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handlePositionChange("x", position.x + 0.5)}
                  >
                    <PlusCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[position.x]}
                min={-5}
                max={5}
                step={0.1}
                onValueChange={(value) => handlePositionChange("x", value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Position Y</Label>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handlePositionChange("y", position.y - 0.5)}
                  >
                    <MinusCircle className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handlePositionChange("y", position.y + 0.5)}
                  >
                    <PlusCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[position.y]}
                min={-5}
                max={5}
                step={0.1}
                onValueChange={(value) => handlePositionChange("y", value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Position Z</Label>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handlePositionChange("z", position.z - 0.5)}
                  >
                    <MinusCircle className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handlePositionChange("z", position.z + 0.5)}
                  >
                    <PlusCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[position.z]}
                min={-5}
                max={5}
                step={0.1}
                onValueChange={(value) => handlePositionChange("z", value[0])}
              />
            </div>
          </TabsContent>

          <TabsContent value="scale" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Échelle du modèle</Label>
                <span className="text-xs text-gray-500"> {scale && scale.toFixed(1)} x</span>
              </div>
              <Slider
                value={[scale]}
                min={0.1}
                max={3}
                step={0.1}
                onValueChange={(value) => setScale(value[0])}
              />
            </div>

            <div className="flex justify-center gap-2 pt-4">
              <Button variant="outline" size="sm" onClick={() => setScale(0.5)}>
                0.5x
              </Button>
              <Button variant="outline" size="sm" onClick={() => setScale(1)}>
                1x
              </Button>
              <Button variant="outline" size="sm" onClick={() => setScale(2)}>
                2x
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="camera" className="space-y-4 pt-4">
            <div className="flex items-center space-x-2 mb-4">
              <Switch id="camera-mode" checked={firstPersonMode} onCheckedChange={onToggleCameraMode} />
              <Label htmlFor="camera-mode" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Mode première personne
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => useModelStore.getState().setCameraPreset("front")}>
                Face
              </Button>
              <Button variant="outline" size="sm" onClick={() => useModelStore.getState().setCameraPreset("back")}>
                Arrière
              </Button>
              <Button variant="outline" size="sm" onClick={() => useModelStore.getState().setCameraPreset("left")}>
                Gauche
              </Button>
              <Button variant="outline" size="sm" onClick={() => useModelStore.getState().setCameraPreset("right")}>
                Droite
              </Button>
              <Button variant="outline" size="sm" onClick={() => useModelStore.getState().setCameraPreset("top")}>
                Dessus
              </Button>
              <Button variant="outline" size="sm" onClick={() => useModelStore.getState().setCameraPreset("bottom")}>
                Dessous
              </Button>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch id="grid-toggle" checked={showGrid} onCheckedChange={onToggleGrid} />
              <Label htmlFor="grid-toggle" className="flex items-center gap-1">
                <Grid className="h-4 w-4" />
                Afficher la grille
              </Label>
            </div>
          </TabsContent>

          <TabsContent value="environment" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="environment-light" checked={environmentLight} onCheckedChange={onToggleLight} />
                <Label htmlFor="environment-light" className="flex items-center gap-1">
                  <Sun className="h-4 w-4" />
                  Éclairage d'environnement
                </Label>
              </div>

              <div className="pt-2">
                <Label className="mb-1 block">Environnement</Label>
                <Select value={currentEnvironment} onValueChange={onEnvironmentChange} disabled={!environmentLight}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un environnement" />
                  </SelectTrigger>
                  <SelectContent>
                    {environments.map((env) => (
                      <SelectItem key={env} value={env}>
                        {env.charAt(0).toUpperCase() + env.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {environments.slice(0, 6).map((env) => (
                <Button
                  key={env}
                  variant="outline"
                  size="sm"
                  disabled={!environmentLight}
                  className={currentEnvironment === env ? "border-primary" : ""}
                  onClick={() => onEnvironmentChange(env)}
                >
                  {env.charAt(0).toUpperCase() + env.slice(1)}
                </Button>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <Label className="mb-2 block">Capture d'écran</Label>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={onTakeScreenshot}
                >
                  <CameraIcon className="h-4 w-4" />
                  Prendre une capture
                </Button>

                {screenshotUrl && (
                  <div className="space-y-2">
                    <div className="border rounded-md overflow-hidden">
                        {screenshotUrl &&
                        
                        <img
                        src={screenshotUrl || "/next.svg"}
                        alt="Capture d'écran du modèle"
                        className="w-full h-auto"
                      />
                        }
               
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center gap-2"
                      onClick={onDownloadScreenshot}
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {modelInfo && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Info className="h-3 w-3" />
              <span>
                {modelInfo.name} | {modelInfo.vertices} vertices | {modelInfo.triangles} triangles
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
