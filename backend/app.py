from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import whisper
import tempfile
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

# Configuración
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'm4a', 'ogg', 'flac'}
MODEL_SIZE = "base"  # Puedes usar "small", "medium" o "large" para mejor precisión

# Cargar el modelo Whisper
print("⏳ Cargando modelo Whisper...")
model = whisper.load_model(MODEL_SIZE)
print("✅ Modelo Whisper cargado")

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No se proporcionó archivo de audio"}), 400
    
    file = request.files['audio']
    
    if file.filename == '':
        return jsonify({"error": "Nombre de archivo vacío"}), 400
        
    if not allowed_file(file.filename):
        return jsonify({"error": "Tipo de archivo no permitido"}), 400

    # Guardar archivo temporalmente
    filename = secure_filename(file.filename)
    temp_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(temp_path)

    try:
        # Transcribir el audio
        result = model.transcribe(temp_path, word_timestamps=False)

        # Formatear la respuesta como necesitas
        transcription = [
            {
                "start": round(segment["start"], 2),
                "end": round(segment["end"], 2),
                "text": segment["text"].strip()
            }
            for segment in result["segments"]
        ]

        return jsonify({
            "text": " ".join([seg["text"] for seg in transcription]),
            "segments": transcription
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # Eliminar el archivo temporal
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)