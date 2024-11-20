from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Load the Hugging Face transliteration model
transliterator = pipeline('translation', model='billingsmoore/tibetan-phonetic-transliteration')

@app.route('/transliterate', methods=['POST'])
def transliterate():
    try:
        data = request.json
        tibetan_text = data.get('text', '')
        if not tibetan_text:
            return jsonify({'error': 'No Tibetan text provided'}), 400
        
        # Use the Hugging Face model for transliteration
        result = transliterator(tibetan_text)
        transliterated_text = result[0]['translation_text']
        
        return jsonify({'transliteration': transliterated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
