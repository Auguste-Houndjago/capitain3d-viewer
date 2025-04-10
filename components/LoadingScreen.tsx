"use client"

import { useProgress } from "@react-three/drei"
import { Progress } from "@/components/ui/progress"

interface LoadingScreenProps {
  started: boolean
  onStarted: () => void
}

export default function LoadingScreen({ started, onStarted }: LoadingScreenProps) {
  const { progress, total, loaded, item } = useProgress()

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-500 ${started ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="w-full max-w-md px-4 space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">Chargement du modèle 3D</h1>

        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {loaded} / {total} ressources
            </span>
            <span>{progress.toFixed(0)}%</span>
          </div>
        </div>

        <div className="text-sm text-gray-400 text-center truncate">{item}</div>

        {progress === 100 && (
          <button
            onClick={onStarted}
            className="w-full py-2 px-4 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Entrer dans la scène
          </button>
        )}
      </div>
    </div>
  )
}
