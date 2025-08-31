"use client"

import { useState } from "react"

// Componentes UI simplificados
const Card = ({ children, className }) => {
  return <div className={`bg-white rounded-lg shadow ${className || ""}`}>{children}</div>
}

const Tabs = ({ children, value, onValueChange }) => {
  return <div className="w-full">{children}</div>
}

const TabsList = ({ children, className }) => {
  return <div className={`flex mb-4 border-b ${className || ""}`}>{children}</div>
}

const TabsTrigger = ({ children, value, onClick, activeValue }) => {
  const isActive = value === activeValue
  return (
    <button
      className={`flex-1 py-2 px-4 text-center font-medium ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
        }`}
      onClick={() => onClick(value)}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ children, value, activeValue }) => {
  if (value !== activeValue) return null
  return <div className="mt-4">{children}</div>
}

export default function TranscriptionResult({ transcriptionData }) {
  const [viewMode, setViewMode] = useState("full")

  return (
    <div>
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="full" onClick={() => setViewMode("full")} activeValue={viewMode}>
            Texto Completo
          </TabsTrigger>
          <TabsTrigger value="segments" onClick={() => setViewMode("segments")} activeValue={viewMode}>
            Por Segmentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="full" activeValue={viewMode}>
          <Card className="p-4 bg-white max-h-[400px] overflow-y-auto">
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{transcriptionData.text}</p>
          </Card>
        </TabsContent>

        <TabsContent value="segments" activeValue={viewMode}>
          <Card className="p-4 bg-white max-h-[400px] overflow-y-auto">
            <ul className="space-y-3">
              {transcriptionData.segments.map((segment, index) => (
                <li key={index} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded px-2 py-1 mr-3 whitespace-nowrap">
                      {formatTime(segment.start)} - {formatTime(segment.end)}
                    </span>
                    <p className="text-gray-800">{segment.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00"

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
