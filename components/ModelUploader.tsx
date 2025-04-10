import React, { useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Upload } from 'lucide-react'
import { useModelStore } from '@/store/modelStore'

export default function ModelUploader() {
  const setModelUrl = useModelStore((state) => state.setModelUrl)

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Vérifier si le fichier est un modèle 3D
      if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
        // Créer une URL pour le fichier
        const objectUrl = URL.createObjectURL(file)
        setModelUrl(objectUrl)
      } else {
        alert('Veuillez sélectionner un fichier .glb ou .gltf')
      }
    }
  }, [setModelUrl])

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <Button
        variant="outline"
        className="bg-accent flex items-center gap-2"
        onClick={() => document.getElementById('model-upload')?.click()}
      >
        <Upload className="h-4 w-4" />
        Charger un modèle
      </Button>
      <input
        type="file"
        id="model-upload"
        className="hidden"
        accept=".glb,.gltf"
        onChange={handleFileChange}
      />
    </div>
  )
} 