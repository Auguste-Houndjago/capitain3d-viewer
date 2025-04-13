import { useEffect, useRef } from 'react'
import { useAudioStore } from '@/store/audioStore'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'

export default function AudioControls() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    tracks,
    setCurrentTrack, 
    setIsPlaying, 
    setVolume 
  } = useAudioStore()

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Effet pour gérer la lecture quand currentTrack change
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [currentTrack])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const handleTrackChange = (url: string) => {
    setCurrentTrack(url)
  }

  const togglePlay = () => {
    if (!currentTrack && tracks.length > 0) {
      setCurrentTrack(tracks[0].url)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value))
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg backdrop-blur-sm">
      <audio
        ref={audioRef}
        src={currentTrack || undefined}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-2 flex items-start align-middle rounded-full bg-gray-500 hover:bg-gray-600 text-white"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          <div className="flex items-center gap-2">
            {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 range-gray "
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {tracks.map((track) => (
            <button
              key={track.url}
              onClick={() => handleTrackChange(track.url)}
              className={`text-left px-3 py-1 rounded ${
                currentTrack === track.url
                  ? 'bg-gray-200 text-gray-500'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {track.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 