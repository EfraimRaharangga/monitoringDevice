# app.py
from flask import Flask, request, jsonify, render_template
from dataStore import update_client, get_all_clients
import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/data', methods=['POST'])
def receive_data():
    content = request.json
    ip = content.get('hostname')
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    content['timestamp'] = timestamp
    update_client(ip, content)
    return {'status': 'success'}

@app.route('/api/clients', methods=['GET'])
def get_clients():
    return jsonify(get_all_clients())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)
