from flask import Flask, request, jsonify
from pyewts import pyewts
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
converter = pyewts()

@app.route('/transliterate', methods=['POST'])
def transliterate():
    try:
        data = request.json
        tibetan_text = data.get('text', '')
        if tibetan_text == '':
            return jsonify({'error': 'No Tibetan text provided'}), 400
        transliterated_text = converter.toWylie(tibetan_text)
        return jsonify({'transliteration': transliterated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
