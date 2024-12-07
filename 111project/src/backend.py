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

@app.route('/volunteer', methods=['POST'])
def add_volunteer():
    """ Add a volunteer to an event """
    data = request.json
    event_id = data.get('eventId')
    user_email = "user@example.com"  # Replace with the actual user email

    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO volunteers (v_roles, p_email, v_isVolunteering)
            VALUES ('Volunteer', ?, TRUE)
        """, (user_email,))
        cursor.execute("""
            UPDATE events
            SET e_numattending = e_numattending + 1
            WHERE e_name = ?
        """, (event_id,))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Successfully volunteered for the event"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"status": "failure", "message": "Already volunteered for this event"}), 400
    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500
    
@app.route('/unvolunteer', methods=['POST'])
def remove_volunteer():
    """ Remove a volunteer from an event """
    data = request.json
    event_id = data.get('eventId')
    user_email = "user@example.com"  # Replace with the actual user email

    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("""
            DELETE FROM volunteers
            WHERE p_email = ? AND v_roles = 'Volunteer'
        """, (user_email,))
        cursor.execute("""
            UPDATE events
            SET e_numattending = e_numattending - 1
            WHERE e_name = ?
        """, (event_id,))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Successfully removed from the event"}), 200
    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500

@app.route('/clubs', methods=['GET'])
def get_clubs():
    """ Fetch all clubs from the club table """
    clubs = query_db("SELECT c_name, c_address, c_meeting_times, c_num_members FROM club")
    if clubs:
        return jsonify({
            "status": "success",
            "clubs": [
                {
                    "name": c[0],
                    "address": c[1],
                    "meeting_times": c[2],
                    "num_members": c[3]
                }
                for c in clubs
            ]
        })
    return jsonify({"status": "failure", "message": "No clubs found"}), 404

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

@app.route('/events', methods=['POST'])
def add_event():
    """ Add a new event to the events table """
    data = request.json
    name = data.get('name')
    event_type = data.get('type')
    num_attending = data.get('num_attending', 0)
    address = data.get('address')

    # Validate input
    if not name or not event_type or not address:
        return jsonify({"status": "failure", "message": "Missing required fields"}), 400

    # Insert the new event into the database
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO events (e_name, e_type, e_numattending, e_address)
            VALUES (?, ?, ?, ?)
        """, (name, event_type, num_attending, address))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Event added successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"status": "failure", "message": "Event name already exists"}), 400
    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500

@app.route('/clubs', methods=['POST'])
def add_club():
    """ Add a new club to the club table """
    data = request.json
    name = data.get('name')
    address = data.get('address')
    meeting_times = data.get('meeting_times')
    num_members = data.get('num_members', 0)

    # Validate input
    if not name or not address or not meeting_times:
        return jsonify({"status": "failure", "message": "Missing required fields"}), 400

    # Insert the new club into the database
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO club (c_name, c_address, c_meeting_times, c_num_members)
            VALUES (?, ?, ?, ?)
        """, (name, address, meeting_times, num_members))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Club added successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"status": "failure", "message": "Club name already exists"}), 400
    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500

@app.route('/friend_groups', methods=['GET'])
def get_friend_groups():
    """ Fetch all friend groups from the friend_groups table """
    friend_groups = query_db("SELECT fg_gcname, fg_num_members FROM friend_groups")
    if friend_groups:
        return jsonify({
            "status": "success",
            "friend_groups": [
                {
                    "name": fg[0],
                    "num_members": fg[1]
                }
                for fg in friend_groups
            ]
        })
    return jsonify({"status": "failure", "message": "No friend groups found"}), 404

@app.route('/interest_groups', methods=['GET'])
def get_interest_groups():
    """ Fetch all interest groups from the interest_group table """
    interest_groups = query_db("SELECT ig_name, ig_main_activity, ig_num_members FROM interest_group")
    if interest_groups:
        return jsonify({
            "status": "success",
            "interest_groups": [
                {
                    "name": ig[0],
                    "main_activity": ig[1],
                    "num_members": ig[2]
                }
                for ig in interest_groups
            ]
        })
    return jsonify({"status": "failure", "message": "No interest groups found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
