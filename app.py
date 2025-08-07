from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import openai
import os

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/preguntar', methods=['POST'])
def preguntar():
    data = request.json
    pregunta = data.get("mensaje", "")
    try:
        respuesta = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Eres un asistente estilo Jarvis, serio, eficiente, y con tono elegante."},
                {"role": "user", "content": pregunta}
            ]
        )
        texto_respuesta = respuesta.choices[0].message['content']
        return jsonify({"respuesta": texto_respuesta})
    except Exception as e:
        return jsonify({"respuesta": f"Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
