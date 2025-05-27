"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"

// Componente Slider simplificado
const Slider = ({ value, min, max, step, onValueChange }) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onValueChange([Number.parseFloat(e.target.value)])}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
  )
}

// Componente Button simplificado
const Button = ({ children, onClick, variant, size, className }) => {
  const baseClass = "flex items-center justify-center rounded font-medium transition-colors"
  const variantClass =
    variant === "outline"
      ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      : "bg-blue-600 text-white hover:bg-blue-700"
  const sizeClass = size === "icon" ? "p-2" : "px-4 py-2"

  return (
    <button className={`${baseClass} ${variantClass} ${sizeClass} ${className || ""}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default function AudioPlayer({ audioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
    }

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime)
    }

    // Events
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)
    audio.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
      audio.removeEventListener("ended", () => setIsPlaying(false))
    }
  }, [audioUrl])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const skipBackward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(audio.currentTime - 10, 0)
  }

  const skipForward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(audio.currentTime + 10, duration)
  }

  const handleSliderChange = (value) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = value[0]
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{formatTime(currentTime)}</span>
        <span className="text-sm text-gray-500">{formatTime(duration)}</span>
      </div>

      <Slider
        value={[currentTime]}
        min={0}
        max={duration || 100}
        step={0.01}
        onValueChange={handleSliderChange}
        className="mb-4"
      />

      <div className="flex justify-center items-center gap-2">
        <Button variant="outline" size="icon" onClick={skipBackward} className="h-9 w-9 rounded-full">
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          onClick={togglePlayPause}
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>

        <Button variant="outline" size="icon" onClick={skipForward} className="h-9 w-9 rounded-full">
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
