from flask import Flask, jsonify, request, send_from_directory
from data_manager import DataManager
import os

app = Flask(__name__, static_folder='static')
dm = DataManager()

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

# --- API: BOOKS ---
@app.route('/api/books', methods=['GET'])
def get_books():
    return jsonify(dm.get_all_books())

@app.route('/api/books', methods=['POST'])
def add_book():
    data = request.json
    new_book = dm.add_book(data)
    return jsonify(new_book), 201

# --- API: MEMBERS ---
@app.route('/api/members', methods=['GET'])
def get_members():
    return jsonify(dm.get_all_members())

@app.route('/api/members', methods=['POST'])
def add_member():
    data = request.json
    new_member = dm.add_member(data)
    return jsonify(new_member), 201

# --- API: ISSUES ---
@app.route('/api/issues', methods=['GET'])
def get_issues():
    return jsonify(dm.get_all_issues())

@app.route('/api/issues', methods=['POST'])
def issue_book():
    data = request.json
    result = dm.issue_book(data['book_id'], data['member_id'])
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result), 201

@app.route('/api/return', methods=['POST'])
def return_book():
    data = request.json
    result = dm.return_book(data['issue_id'])
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result)

# --- API: STATS ---
@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify(dm.get_stats())

if __name__ == '__main__':
    app.run(debug=True, port=5000)
