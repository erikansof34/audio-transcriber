"use client"

import { useState, useCallback } from "react"
import { FileAudio, Upload, Loader2 } from "lucide-react"

export default function DropZone({ onFilesDrop, isLoading = false }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging) {
        setIsDragging(true)
      }
    },
    [isDragging],
  )

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFilesDrop(e.dataTransfer.files)
      }
    },
    [onFilesDrop],
  )

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isLoading ? (
        <Loader2 className="h-12 w-12 text-blue-500 mx-auto animate-spin" />
      ) : (
        <>
          <div className="mx-auto flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <FileAudio className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Arrastra y suelta tu archivo de audio aquí</h3>
          <p className="text-sm text-gray-500">Soporta archivos MP3, WAV, M4A, FLAC y más</p>
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Upload className="h-3 w-3 mr-1" />
              Suelta para procesar
            </div>
          </div>
        </>
      )}
    </div>
  )
}
