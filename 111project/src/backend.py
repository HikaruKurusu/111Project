from flask import Flask, request, jsonify
from flask_cors import CORS  # To handle cross-origin requests if needed
import sqlite3
import os

app = Flask(__name__)
CORS(app)  # Enable CORS if your front-end and back-end are running on different ports

DATABASE = 'Checkpoint2-dbase.sqlite3'  # Path to your SQLite database file

def query_db(query, args=(), one=False):
    """ Helper function to interact with the SQLite database """
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(query, args)
    result = cursor.fetchall()
    conn.close()
    return (result[0] if result else None) if one else result

@app.route('/login', methods=['POST'])
def login():
    """ Login endpoint that checks email and password against the database """
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Check if email and password are provided
    if not email or not password:
        return jsonify({"status": "failure", "message": "Email and password are required"}), 400

    # Query the database to check if the user exists
    user = query_db("SELECT p_email, p_name FROM person WHERE p_email = ? AND p_password = ?", [email, password], one=True)

    if user:
        # If user found, send success response
        return jsonify({
            "status": "success",
            "message": "Login successful",
            "user": {"email": user[0], "name": user[1]}
        })
    
    # If no user found, send failure response
    return jsonify({"status": "failure", "message": "Invalid email or password"}), 401

if __name__ == '__main__':
    app.run(debug=True)
