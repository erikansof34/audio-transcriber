# 📝 audio-transcriber

Este es un proyecto monorepo que contiene un **backend en Python (Flask)** y un **frontend en React**. La aplicación permite subir archivos de audio, transcribirlos, y visualizar los resultados de forma interactiva.

---

## 📁 Estructura del Proyecto

audio-transcriber/
│
├── backend/ # API backend en Python (Flask)
│ ├── app.py # Archivo principal de la aplicación Flask
│ └── requirements.txt # Dependencias del backend
│
├── frontend/ # Aplicación frontend en React
│ ├── public/ # Archivos públicos estáticos
│ ├── src/ # Código fuente de React
│ │ ├── assets/
│ │ ├── components/
│ │ │ ├── audio-player.jsx
│ │ │ ├── drop-zone.jsx
│ │ │ └── transcription-result.jsx
│ │ ├── App.css
│ │ ├── App.jsx
│ │ ├── index.css
│ │ └── main.jsx
│ ├── .gitignore
│ ├── eslint.config.js
│ ├── index.html
│ ├── package.json
│ ├── package-lock.json
│ ├── vite.config.js
│ └── README.md # README específico del frontend
│
└── README.md # Este archivo 

---

## 🚀 Instalación

### 🧠 Requisitos previos

- Node.js v18 o superior
- Python 3.9 o superior
- pip (gestor de paquetes de Python)
- Chocolatey (gestor de paquetes para Windows) - Instalación
- FFmpeg (instalar después de Chocolatey):
```bash
choco install ffmpeg
```

---

### 🔧 Backend (Flask)

1. Entra en la carpeta del backend:

```bash
cd backend
```

2. Instala las dependencias de Python:

```bash
pip install -r requirements.txt
```

3. Inicia el servidor backend:

```bash
python app.py
```

### 🔧 Frontend (React)

1. Navega al directorio del frontend:

```bash
cd frontend
```

2. Instala las dependencias de Node.js (usa npm ci para instalar exactamente las versiones del lockfile):

```bash
npm ci
```

3. Inicia la aplicación frontend:

```bash
npm run dev
```

---

## 🌐 Acceso

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

