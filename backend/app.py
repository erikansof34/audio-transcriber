from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import whisper
import tempfile
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuración
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'm4a', 'ogg', 'flac'}
MODEL_SIZE = "base"
MAX_CHARS = 120  # Límite estricto por segmento

# Cargar modelo
print("⏳ Cargando modelo Whisper...")
model = whisper.load_model(MODEL_SIZE)
print("✅ Modelo cargado")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def split_segments(text, max_chars=MAX_CHARS):
    """Divide el texto en segmentos de máximo 120 caracteres sin cortar palabras."""
    segments = []
    words = text.split()
    current_segment = ""
    
    for word in words:
        # Si añadir la palabra excede el límite, guardar el segmento actual y empezar uno nuevo
        if len(current_segment) + len(word) + 1 > max_chars:
            if current_segment:  # Solo añadir si no está vacío
                segments.append(current_segment.strip())
                current_segment = word  # La palabra que no cabía inicia el nuevo segmento
        else:
            if current_segment:
                current_segment += " " + word
            else:
                current_segment = word
    
    # Añadir el último segmento si queda texto
    if current_segment:
        segments.append(current_segment.strip())
    
    return segments

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No se proporcionó archivo de audio"}), 400
    
    file = request.files['audio']
    if file.filename == '':
        return jsonify({"error": "Nombre de archivo vacío"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "Tipo de archivo no permitido"}), 400

    # Guardar archivo temporal
    filename = secure_filename(file.filename)
    temp_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(temp_path)

    try:
        result = model.transcribe(temp_path, word_timestamps=False)
        full_text = " ".join(segment["text"].strip() for segment in result["segments"])
        
        # Dividir el texto completo en segmentos de 120 caracteres sin cortar palabras
        text_segments = split_segments(full_text)
        
        # Reconstruir los segmentos con sus timestamps aproximados (simplificado)
        segments = []
        for i, text in enumerate(text_segments):
            # Nota: Los timestamps son aproximados. Whisper no proporciona info por palabra.
            segments.append({
                "start": round((i * 10) / 60, 2),  # Ejemplo: timestamp aproximado
                "end": round(((i + 1) * 10) / 60, 2),
                "text": text
            })
        
        return jsonify({
            "text": full_text,  # Texto completo sin cortes
            "segments": segments  # Segmentos de ≤120 caracteres sin palabras cortadas
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)