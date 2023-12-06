from flask import Flask, request, jsonify
from flask_cors import CORS  # You need to install this package if not already installed
import scrape

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains on all routes

@app.route('/scrape', methods=['POST'])
def handle_scrape():
    print("Scrape endpoint hit")  # Log when the endpoint is accessed
    data = request.json
    print("Received data:", data)  # Log the data received
    data = request.json
    urls = data.get('urls')
    
    if not urls:
        return jsonify({'error': 'No URLs provided'}), 400

    try:
        results = scrape.run(urls)
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Set debug to False when deploying to production
    app.run(debug=True, port=5000)
