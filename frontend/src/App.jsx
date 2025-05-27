"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, FileAudio, Download, Copy, Loader2, Play, Pause, SkipBack, SkipForward, X, Save, Edit, Sun, Moon } from "lucide-react"
import "./App.css"

const DropZone = ({ onFilesDrop, isLoading, darkMode }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) {
      setIsDragging(true)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesDrop(e.dataTransfer.files)
    }
  }

  return (
    <div
      className={`drop-zone ${isDragging ? "dragging" : ""} ${isLoading ? "loading" : ""} ${darkMode ? "dark" : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isLoading ? (
        <Loader2 className="spinner" />
      ) : (
        <>
          <div className={`icon-container ${darkMode ? "dark" : ""}`}>
            <FileAudio />
          </div>
          <h3 className={darkMode ? "dark" : ""}>Arrastra y suelta tu archivo de audio aquí</h3>
          <p className={darkMode ? "dark" : ""}>Soporta archivos MP3, WAV, M4A, FLAC y más</p>
          <div className={`drop-badge ${darkMode ? "dark" : ""}`}>
            <Upload size={12} />
            Suelta para procesar
          </div>
        </>
      )}
    </div>
  )
}

const AudioPlayer = ({ audioUrl, darkMode }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)

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

  const handleSliderChange = (e) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = Number.parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleLoadedData = () => {
    setDuration(audioRef.current.duration)
  }

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div className={`audio-player ${darkMode ? "dark" : ""}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onLoadedData={handleLoadedData}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className={`time-display ${darkMode ? "dark" : ""}`}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <input
        type="range"
        className={`player-slider ${darkMode ? "dark" : ""}`}
        min={0}
        max={duration || 100}
        step={0.01}
        value={currentTime}
        onChange={handleSliderChange}
      />

      <div className="player-controls">
        <button className={`control-button ${darkMode ? "dark" : ""}`} onClick={skipBackward}>
          <SkipBack size={16} />
        </button>

        <button className={`control-button play-button ${darkMode ? "dark" : ""}`} onClick={togglePlayPause}>
          {isPlaying ? <Pause /> : <Play style={{ marginLeft: "2px" }} />}
        </button>

        <button className={`control-button ${darkMode ? "dark" : ""}`} onClick={skipForward}>
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  )
}

const EditableText = ({ text, onSave, className, darkMode }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(text)
  const textareaRef = useRef(null)

  useEffect(() => {
    setEditedText(text)
  }, [text])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.selectionStart = textareaRef.current.value.length
    }
  }, [isEditing])

  const handleSave = () => {
    onSave(editedText)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className={`editable-text ${className} ${darkMode ? "dark" : ""}`}>
        <p className={`transcription-text ${darkMode ? "dark" : ""}`}>{text}</p>
        <button 
          onClick={() => setIsEditing(true)}
          className={`edit-button ${darkMode ? "dark" : ""}`}
          title="Editar texto"
        >
          <Edit size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className={`editable-text editing ${className} ${darkMode ? "dark" : ""}`}>
      <textarea
        ref={textareaRef}
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        className={`transcription-text-edit ${darkMode ? "dark" : ""}`}
      />
      <div className="edit-buttons">
        <button 
          onClick={handleSave}
          className={`save-button ${darkMode ? "dark" : ""}`}
          title="Guardar cambios"
        >
          <Save size={16} />
        </button>
        <button 
          onClick={() => {
            setEditedText(text)
            setIsEditing(false)
          }}
          className={`cancel-button ${darkMode ? "dark" : ""}`}
          title="Cancelar"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

const EditableSegment = ({ segment, onSave, darkMode }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(segment.text)
  const textareaRef = useRef(null)

  useEffect(() => {
    setEditedText(segment.text)
  }, [segment.text])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.selectionStart = textareaRef.current.value.length
    }
  }, [isEditing])

  const handleSave = () => {
    onSave({ ...segment, text: editedText })
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className={`segment-content ${darkMode ? "dark" : ""}`}>
        <span className={`timestamp ${darkMode ? "dark" : ""}`}>
          {formatTime(segment.start)} - {formatTime(segment.end)}
        </span>
        <div className={`segment-text-container ${darkMode ? "dark" : ""}`}>
          <p className={`segment-text ${darkMode ? "dark" : ""}`}>{segment.text}</p>
          <button 
            onClick={() => setIsEditing(true)}
            className={`edit-button ${darkMode ? "dark" : ""}`}
            title="Editar segmento"
          >
            <Edit size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`segment-content editing ${darkMode ? "dark" : ""}`}>
      <span className={`timestamp ${darkMode ? "dark" : ""}`}>
        {formatTime(segment.start)} - {formatTime(segment.end)}
      </span>
      <div className={`segment-text-edit-container ${darkMode ? "dark" : ""}`}>
        <textarea
          ref={textareaRef}
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className={`segment-text-edit ${darkMode ? "dark" : ""}`}
        />
        <div className="edit-buttons">
          <button 
            onClick={handleSave}
            className={`save-button ${darkMode ? "dark" : ""}`}
            title="Guardar cambios"
          >
            <Save size={14} />
          </button>
          <button 
            onClick={() => {
              setEditedText(segment.text)
              setIsEditing(false)
            }}
            className={`cancel-button ${darkMode ? "dark" : ""}`}
            title="Cancelar"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

const TranscriptionResult = ({ transcriptionData, onTextUpdate, onSegmentUpdate, darkMode }) => {
  const [viewMode, setViewMode] = useState("full")

  return (
    <div>
      <div className={`transcription-tabs ${darkMode ? "dark" : ""}`}>
        <div className={`transcription-tabs-list ${darkMode ? "dark" : ""}`}>
          <button 
            className={`tab-trigger ${viewMode === "full" ? "active" : ""} ${darkMode ? "dark" : ""}`} 
            onClick={() => setViewMode("full")}
          >
            Texto Completo
          </button>
          <button
            className={`tab-trigger ${viewMode === "segments" ? "active" : ""} ${darkMode ? "dark" : ""}`}
            onClick={() => setViewMode("segments")}
          >
            Por Segmentos
          </button>
        </div>

        {viewMode === "full" && (
          <div className={`transcription-content ${darkMode ? "dark" : ""}`}>
            <EditableText 
              text={transcriptionData.text} 
              onSave={onTextUpdate}
              className="full-text-editor"
              darkMode={darkMode}
            />
          </div>
        )}

        {viewMode === "segments" && (
          <div className={`transcription-content ${darkMode ? "dark" : ""}`}>
            <ul className={`segments-list ${darkMode ? "dark" : ""}`}>
              {transcriptionData.segments.map((segment, index) => (
                <li key={index} className={`segment-item ${darkMode ? "dark" : ""}`}>
                  <EditableSegment
                    segment={segment}
                    onSave={(updatedSegment) => onSegmentUpdate(index, updatedSegment)}
                    darkMode={darkMode}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionData, setTranscriptionData] = useState(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [notifications, setNotifications] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Aplicar clase dark al body cuando cambia el modo
    if (darkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [darkMode])

  const showToast = (title, description, type = "info") => {
    const id = Date.now()
    const newNotification = { id, title, description, type }
    
    setNotifications(prev => [...prev, newNotification])
    
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    showToast(
      darkMode ? "Modo claro activado" : "Modo oscuro activado", 
      `La interfaz ahora está en modo ${darkMode ? "claro" : "oscuro"}`,
      "info"
    )
  }

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.includes("audio")) {
      showToast("Error", "Por favor, selecciona un archivo de audio válido.", "error")
      return
    }

    await processAudioFile(file)
  }

  const processAudioFile = async (file) => {
    setIsTranscribing(true)
    setTranscriptionData(null)

    try {
      const audioUrl = URL.createObjectURL(file)
      const formData = new FormData()
      formData.append('audio', file)

      showToast("Procesando", "La transcripción ha comenzado. Esto puede tomar unos minutos...", "info")

      const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error en la transcripción")
      }

      const result = await response.json()

      setTranscriptionData({
        text: result.text,
        segments: result.segments,
        audioUrl,
        fileName: file.name,
      })

      setActiveTab("result")
      showToast("¡Transcripción completada!", "El audio ha sido transcrito correctamente.", "success")
    } catch (error) {
      console.error("Error transcribing audio:", error)
      showToast("Error", `Ocurrió un error al transcribir el audio: ${error.message}`, "error")
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const downloadTranscription = () => {
    if (!transcriptionData) return

    const element = document.createElement("a")
    const file = new Blob([JSON.stringify(transcriptionData.segments, null, 2)], { type: "application/json" })
    element.href = URL.createObjectURL(file)
    element.download = `${transcriptionData.fileName.replace(/\.[^/.]+$/, "")}_transcripcion.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    showToast("Descarga iniciada", "La transcripción se está descargando.", "success")
  }

  const copyToClipboard = () => {
    if (!transcriptionData) return

    navigator.clipboard.writeText(JSON.stringify(transcriptionData.segments, null, 2))

    showToast("Copiado", "La transcripción ha sido copiada al portapapeles.", "success")
  }

  const handleTextUpdate = (newText) => {
    setTranscriptionData(prev => ({
      ...prev,
      text: newText
    }))
    showToast("Texto actualizado", "Los cambios se han guardado correctamente.", "success")
  }

  const handleSegmentUpdate = (index, updatedSegment) => {
    setTranscriptionData(prev => {
      const newSegments = [...prev.segments]
      newSegments[index] = updatedSegment
      
      const newText = newSegments.map(s => s.text).join(" ")
      
      return {
        ...prev,
        segments: newSegments,
        text: newText
      }
    })
    showToast("Segmento actualizado", "Los cambios se han guardado correctamente.", "success")
  }

  return (
    <main className={`app-container ${darkMode ? "dark" : ""}`}>
      {/* Notificaciones */}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`notification ${notification.type} ${darkMode ? "dark" : ""}`}
          >
            <div className="notification-content">
              <div className="notification-header">
                <h4>{notification.title}</h4>
                <button 
                  onClick={() => removeNotification(notification.id)}
                  className={`notification-close ${darkMode ? "dark" : ""}`}
                >
                  <X size={16} />
                </button>
              </div>
              <p>{notification.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de toggle modo oscuro/claro */}
      <button 
        onClick={toggleDarkMode}
        className={`theme-toggle ${darkMode ? "dark" : ""}`}
        title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="content-container">
        <div className={`header ${darkMode ? "dark" : ""}`}>
          <h1>Transcriptor de Audio</h1>
          <p>
            Arrastra y suelta archivos de audio o selecciona archivos para transcribir.
            El procesamiento se realiza en nuestro servidor seguro.
          </p>
        </div>

        <div className="tabs">
          <div className={`tabs-list ${darkMode ? "dark" : ""}`}>
            <button
              className={`tab-trigger ${activeTab === "upload" ? "active" : ""} ${darkMode ? "dark" : ""}`}
              onClick={() => setActiveTab("upload")}
              disabled={isTranscribing}
            >
              Subir Audio
            </button>
            <button
              className={`tab-trigger ${activeTab === "result" ? "active" : ""} ${darkMode ? "dark" : ""}`}
              onClick={() => setActiveTab("result")}
              disabled={!transcriptionData}
            >
              Resultado
            </button>
          </div>

          {activeTab === "upload" && (
            <div className={`card ${darkMode ? "dark" : ""}`}>
              <DropZone onFilesDrop={handleFileSelect} isLoading={isTranscribing} darkMode={darkMode} />

              <div className={`or-divider ${darkMode ? "dark" : ""}`}>o</div>
              <div style={{ textAlign: "center" }}>
                <button 
                  onClick={handleBrowseClick} 
                  disabled={isTranscribing} 
                  className={`button button-outline ${darkMode ? "dark" : ""}`}
                >
                  <FileAudio size={16} />
                  Seleccionar archivo de audio
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  accept="audio/*"
                  className="hidden"
                  style={{ display: "none" }}
                />
              </div>

              {isTranscribing && (
                <div className={`loading-container ${darkMode ? "dark" : ""}`}>
                  <Loader2 className="spinner" />
                  <p>Transcribiendo audio...</p>
                  <p className="hint">Esto puede tomar unos momentos dependiendo del tamaño del archivo.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "result" && transcriptionData && (
            <div className={`card ${darkMode ? "dark" : ""}`}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ 
                  fontSize: "1.25rem", 
                  fontWeight: "600", 
                  color: darkMode ? "#e5e7eb" : "#1f2937", 
                  marginBottom: "0.5rem" 
                }}>
                  {transcriptionData.fileName}
                </h2>

                <AudioPlayer audioUrl={transcriptionData.audioUrl} darkMode={darkMode} />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div className={`transcription-header ${darkMode ? "dark" : ""}`}>
                  <h3>Transcripción</h3>
                  <div className="action-buttons">
                    <button 
                      className={`button button-outline ${darkMode ? "dark" : ""}`} 
                      onClick={copyToClipboard}
                    >
                      <Copy size={16} />
                      Copiar
                    </button>
                    <button 
                      className={`button button-outline ${darkMode ? "dark" : ""}`} 
                      onClick={downloadTranscription}
                    >
                      <Download size={16} />
                      Descargar
                    </button>
                  </div>
                </div>

                <TranscriptionResult 
                  transcriptionData={transcriptionData}
                  onTextUpdate={handleTextUpdate}
                  onSegmentUpdate={handleSegmentUpdate}
                  darkMode={darkMode}
                />
              </div>

              <div className="center-button">
                <button 
                  className={`button button-primary ${darkMode ? "dark" : ""}`} 
                  onClick={() => setActiveTab("upload")}
                >
                  <Upload size={16} />
                  Transcribir otro audio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default App