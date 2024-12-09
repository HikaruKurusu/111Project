from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os  # Make sure this is imported

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

DATABASE = os.path.join(os.path.dirname(__file__), 'Checkpoint3-dbase.sqlite3')

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
    return jsonify({"status": "failure", "message": "Invalid email or password"}), 400
    
@app.route('/events/volunteer', methods=['POST'])
def volunteer_for_event():
    data = request.json
    event_name = data.get('event_name')
    email = data.get('email')
    
    if not event_name or not email:
        return jsonify({"status": "failure", "message": "Event name and email are required"}), 400
    
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Check if the event exists
        cursor.execute("SELECT 1 FROM events WHERE e_name = ?", (event_name,))
        if not cursor.fetchone():
            return jsonify({"status": "failure", "message": "Event not found"}), 404
        
        # Check if the user is already volunteering for this event
        cursor.execute("SELECT 1 FROM volunteers WHERE p_email = ? AND v_eventName = ?", (email, event_name))
        if cursor.fetchone():
            return jsonify({"status": "failure", "message": "User is already volunteering for this event"}), 400
        
        # Increment the volunteer count
        cursor.execute("UPDATE events SET e_numVolunteers = e_numVolunteers + 1 WHERE e_name = ?", (event_name,))
        
        # Add the volunteer to the volunteers table
        cursor.execute("INSERT INTO volunteers (v_roles, p_email, v_eventName) VALUES (?, ?, ?)", ('Volunteer', email, event_name))
        
        conn.commit()
        conn.close()
        
        return jsonify({"status": "success", "message": "Successfully volunteered for the event!"}), 200
    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500

@app.route('/events/unvolunteer', methods=['POST'])
def unvolunteer_for_event():
    data = request.json
    event_name = data.get('event_name')
    email = data.get('email')
    
    if not event_name or not email:
        return jsonify({"status": "failure", "message": "Event name and email are required"}), 400
    
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Check if the event exists
        cursor.execute("SELECT 1 FROM events WHERE e_name = ?", (event_name,))
        if not cursor.fetchone():
            return jsonify({"status": "failure", "message": "Event not found"}), 404
        
        # Decrement the volunteer count
        cursor.execute("UPDATE events SET e_numVolunteers = e_numVolunteers - 1 WHERE e_name = ?", (event_name,))
        
        # Remove the volunteer from the volunteers table
        cursor.execute("DELETE FROM volunteers WHERE p_email = ? AND v_eventName = ?", (email, event_name))
        
        conn.commit()
        conn.close()
        
        return jsonify({"status": "success", "message": "Successfully unvolunteered for the event!"}), 200
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
    events = query_db("SELECT e_name, e_type, e_numattending, e_address, e_numVolunteers FROM events")
    if events:
        return jsonify({
            "status": "success",
            "events": [
                {
                    "name": e[0],
                    "type": e[1],
                    "num_attending": e[2],
                    "address": e[3],
                    "numVolunteers": e[4]
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
    num_volunteers = data.get('num_volunteers', 0)
    creator_email = data.get('creator_email')

    # Validate input
    if not name or not event_type or not address or not creator_email:
        return jsonify({"status": "failure", "message": "Missing required fields"}), 400

    # Insert the new event into the database
    try:
        conn = sqlite3.connect(DATABASE, timeout=10)  # Increase timeout to 10 seconds
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO events (e_name, e_type, e_numattending, e_address, e_numVolunteers, e_creatorEmail)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (name, event_type, num_attending, address, num_volunteers, creator_email))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Event added successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"status": "failure", "message": "Event name already exists"}), 400
    except sqlite3.OperationalError as e:
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
    
@app.route('/clubs/join', methods=['POST'])
def join_club():
    data = request.json
    club_name = data.get('club_name')
    member_name = data.get('member_name')
    
    if not club_name or not member_name:
        return jsonify({"status": "failure", "message": "Club name and member name are required"}), 400
    
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Check if the member is already in the club
        cursor.execute("SELECT 1 FROM club_member WHERE cm_clubname = ? AND cm_name = ?", (club_name, member_name))
        if cursor.fetchone():
            return jsonify({"status": "failure", "message": "Member is already in the club"}), 400
        
        # Add the member to the club_member table
        cursor.execute("INSERT INTO club_member (cm_clubname, cm_name) VALUES (?, ?)", (club_name, member_name))
        
        # Increment the number of members in the club
        cursor.execute("UPDATE club SET c_num_members = c_num_members + 1 WHERE c_name = ?", (club_name,))
        
        conn.commit()
        conn.close()
        
        return jsonify({"status": "success", "message": "Successfully joined the club!"}), 200
    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500

@app.route('/clubs/members', methods=['GET'])
def get_club_members():
    club_name = request.args.get('club_name')
    
    if not club_name:
        return jsonify({"status": "failure", "message": "Club name is required"}), 400
    
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT cm_name FROM club_member WHERE cm_clubname = ?
        """, (club_name,))
        
        members = cursor.fetchall()
        conn.close()
        
        if members:
            return jsonify({
                "status": "success",
                "members": [member[0] for member in members]
            }), 200
        else:
            return jsonify({"status": "failure", "message": "No members found"}), 404
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

@app.route('/friend_groups/join', methods=['POST'])
def join_friend_group():
    data = request.json
    group_name = data.get('group_name')
    member_name = data.get('member_name')
    
    if not group_name or not member_name:
        return jsonify({"status": "failure", "message": "Group name and member name are required"}), 400
    
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Check if the member is already in any friend group
        cursor.execute("SELECT 1 FROM friend_group_member WHERE fgm_member_name = ?", (member_name,))
        if cursor.fetchone():
            return jsonify({"status": "failure", "message": "Member is already in a friend group"}), 400
        
        # Check if the friend group exists
        cursor.execute("SELECT 1 FROM friend_groups WHERE fg_gcname = ?", (group_name,))
        if not cursor.fetchone():
            return jsonify({"status": "failure", "message": "Friend group not found"}), 404
        
        # Add the member to the friend_group_member table
        cursor.execute("INSERT INTO friend_group_member (fgm_name, fgm_member_name) VALUES (?, ?)", (group_name, member_name))
        
        # Increment the number of members in the friend group
        cursor.execute("UPDATE friend_groups SET fg_num_members = fg_num_members + 1 WHERE fg_gcname = ?", (group_name,))
        
        conn.commit()
        conn.close()
        
        return jsonify({"status": "success", "message": "Successfully joined the friend group!"}), 200
    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500

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

@app.route('/interest_groups/join', methods=['POST'])
def join_interest_group():
    data = request.json
    group_name = data.get('group_name')
    member_name = data.get('member_name')
    
    if not group_name or not member_name:
        return jsonify({"status": "failure", "message": "Group name and member name are required"}), 400
    
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Check if the interest group exists
        cursor.execute("SELECT 1 FROM interest_group WHERE ig_name = ?", (group_name,))
        if not cursor.fetchone():
            return jsonify({"status": "failure", "message": "Interest group not found"}), 404
        
        # Add the member to the interest_group_member table
        cursor.execute("INSERT INTO interest_group_member (igm_interest_group_name, igm_name) VALUES (?, ?)", (group_name, member_name))
        
        # Increment the number of members in the interest group
        cursor.execute("UPDATE interest_group SET ig_num_members = ig_num_members + 1 WHERE ig_name = ?", (group_name,))
        
        conn.commit()
        conn.close()
        
        return jsonify({"status": "success", "message": "Successfully joined the interest group!"}), 200
    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500

@app.route('/events/attendees', methods=['GET'])
def get_event_attendees():
    event_name = request.args.get('event_name')  # Get the event name from the query parameter
    
    if not event_name:
        return jsonify({"status": "failure", "message": "Event name is required"}), 400

    attendees = query_db("""
        SELECT ea_person_email
        FROM event_attendees
        WHERE ea_event_name = ?
    """, [event_name])
    
    if attendees:
        return jsonify({
            "status": "success",
            "attendees": [attendee[0] for attendee in attendees]
        })
    
    return jsonify({"status": "failure", "message": "No attendees found for this event"}), 404

@app.route('/events/register', methods=['POST'])
def register_for_event():
    data = request.json
    email = data.get('email')
    event_name = data.get('event_name')

    # Validate the inputs
    if not email or not event_name:
        return jsonify({"status": "failure", "message": "Email and event name are required"}), 400

    try:
        # Connect to the database and enable foreign key support
        conn = sqlite3.connect(DATABASE)
        conn.execute("PRAGMA foreign_keys = ON")  # Enable foreign key support
        cursor = conn.cursor()

        # Check if the event exists
        cursor.execute("SELECT 1 FROM events WHERE e_name = ?", (event_name,))
        event_exists = cursor.fetchone()
        if not event_exists:
            return jsonify({"status": "failure", "message": "Event not found"}), 404

        # Check if the person exists
        cursor.execute("SELECT 1 FROM person WHERE p_email = ?", (email,))
        person_exists = cursor.fetchone()
        if not person_exists:
            return jsonify({"status": "failure", "message": "Person not found"}), 404

        # Check if the user is already registered for this event
        cursor.execute("""
            SELECT 1 FROM event_attendees WHERE ea_event_name = ? AND ea_person_email = ?
        """, (event_name, email))
        existing_attendee = cursor.fetchone()
        
        if existing_attendee:
            return jsonify({"status": "failure", "message": "User already registered for this event"}), 400

        # Insert into event_attendees table
        cursor.execute("""
            INSERT INTO event_attendees (ea_event_name, ea_person_email)
            VALUES (?, ?)
        """, (event_name, email))

        # Update the event's num_attending count
        cursor.execute("""
            UPDATE events
            SET e_numattending = e_numattending + 1
            WHERE e_name = ?
        """, (event_name,))

        conn.commit()
        conn.close()

        return jsonify({"status": "success", "message": "Successfully registered for the event!"}), 201

    except sqlite3.IntegrityError as e:
        print(f"Integrity error: {e}")
        return jsonify({"status": "failure", "message": "Foreign key constraint violation"}), 400
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "failure", "message": str(e)}), 500

@app.route('/interest_groups', methods=['POST'])
def create_interest_group():
    """Add a new interest group to the database"""
    data = request.json
    ig_name = data.get('name')
    ig_main_activity = data.get('main_activity')
    ig_num_members = data.get('num_members', 0)

    # Validate input
    if not ig_name or not ig_main_activity:
        return jsonify({"status": "failure", "message": "Name and main activity are required"}), 400

    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO interest_group (ig_name, ig_main_activity, ig_num_members)
            VALUES (?, ?, ?)
        """, (ig_name, ig_main_activity, ig_num_members))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Interest group created successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"status": "failure", "message": "Interest group name already exists"}), 400
    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500
@app.route('/friend_groups', methods=['POST'])
def create_friend_group():
    """Create a new friend group"""
    data = request.json
    group_name = data.get('name')

    # Validate input
    if not group_name:
        return jsonify({"status": "failure", "message": "Group name is required"}), 400

    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        # Check if the group name already exists
        cursor.execute("SELECT 1 FROM friend_groups WHERE fg_gcname = ?", (group_name,))
        if cursor.fetchone():
            return jsonify({"status": "failure", "message": "Friend group already exists"}), 400

        # Insert the new friend group
        cursor.execute("""
            INSERT INTO friend_groups (fg_gcname, fg_num_members)
            VALUES (?, ?)
        """, (group_name, 0))
        conn.commit()
        conn.close()

        return jsonify({"status": "success", "message": "Friend group created successfully"}), 201
    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
