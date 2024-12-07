from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os  # Make sure this is imported

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

DATABASE = os.path.join(os.path.dirname(__file__), 'Checkpoint2-dbase.sqlite3')

def query_db(query, args=(), one=False):
    """ Helper function to interact with SQLite """
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(query, args)
    result = cursor.fetchall()
    conn.close()
    return (result[0] if result else None) if one else result

@app.route('/login', methods=['POST'])
def login():
    """ Login endpoint that checks email and password """
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Ensure email and password are provided
    if not email or not password:
        return jsonify({"status": "failure", "message": "Email and password are required"}), 400

    # Query the database to validate the user's credentials
    user = query_db("SELECT p_email, p_name FROM person WHERE p_email = ? AND p_password = ?", [email, password], one=True)

    if user:
        # If credentials match, return success
        return jsonify({
            "status": "success",
            "message": "Login successful",
            "user": {"email": user[0], "name": user[1]}
        })
    
    # If no user is found, return failure
    return jsonify({"status": "failure", "message": "Invalid email or password"}), 401

@app.route('/events', methods=['GET'])
def get_events():
    """ Fetch all events from the events table """
    events = query_db("SELECT e_name, e_type, e_numattending, e_address FROM events")
    if events:
        return jsonify({
            "status": "success",
            "events": [
                {
                    "name": e[0],
                    "type": e[1],
                    "num_attending": e[2],
                    "address": e[3]
                }
                for e in events
            ]
        })
    return jsonify({"status": "failure", "message": "No events found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
