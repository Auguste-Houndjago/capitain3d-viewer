import { create } from 'zustand'

interface AudioState {
  currentTrack: string | null
  isPlaying: boolean
  volume: number
  tracks: { name: string; url: string }[]
  setCurrentTrack: (track: string | null) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
}

export const useAudioStore = create<AudioState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  tracks: [
    { name: "Reset", url: "/audio/Reset.mp3" },
    { name: "Cascade", url: "/audio/Cascade.mp3" },
    { name: "The Search", url: "/audio/The-Search.mp3" },
  ],
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume: volume }),
})); 