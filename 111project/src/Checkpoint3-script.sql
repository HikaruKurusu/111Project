DELETE FROM interest_group_member;
DELETE FROM club_member;
DELETE FROM volunteers;
DELETE FROM events;
DELETE FROM locations;
DELETE FROM interest_group;
DELETE FROM friend_groups;
DELETE FROM club;
DELETE FROM person;

-- Insert into person table
INSERT INTO person (p_email, p_name, p_phonenumber, p_password)
VALUES 
    ('john.doe@example.com', 'John Doe', 1234567890, '123'),
    ('jane.smith@example.com', 'Jane Smith', 9876543210, '123'),
    ('alice.jones@example.com', 'Alice Jones', 4561237890, '123'),
    ('mike.jordan@example.com', 'Mike Jordan', 1122334455, '123');

-- Insert into club table
INSERT INTO club (c_name, c_address, c_meeting_times, c_num_members)
VALUES 
    ('Tech Club', '123 Tech St', 'Mon, Wed 6:00 PM', 50),
    ('Sports Club', '456 Sport Ave', 'Tue, Thu 7:00 PM', 30),
    ('Art Club', '789 Art Rd', 'Fri 5:00 PM', 20),
    ('Chess Club', '789 Chess St', 'Fri 6:00 PM', 25);

-- Insert into friend_groups table
INSERT INTO friend_groups (fg_gcname, fg_num_members)
VALUES 
    ('Tech Talk', 15),
    ('Sports Fans', 10),
    ('Artists United', 8),
    ('Chess Enthusiasts', 12);

-- Insert into friend_group_member table (Ensure fg_name exists in friend_groups and fg_member_name exists in person)
INSERT INTO friend_group_member (fgm_name, fgm_member_name)
VALUES 
    ('Tech Talk', 'John Doe'),
    ('ChessEntusiasts', 'Jane Smith'),
    ('Sports Fans', 'Alice Jones'),
    ('Artists United', 'Mike Jordan');

-- Insert into locations table
INSERT INTO locations (l_address, l_name)
VALUES 
    ('123 Tech St', 'Tech Hall'),
    ('456 Sport Ave', 'Gymnasium'),
    ('789 Art Rd', 'Art Gallery'),
    ('789 Chess St', 'Chess Hall');

-- Insert into events table
INSERT INTO events (e_name, e_numattending, e_type, e_address, e_numVolunteers, e_creatorEmail)
VALUES 
    ('Hackathon', 100, 'Competition', '123 Tech St', 0, 'john.doe@example.com'),
    ('Football Match', 50, 'Game', '456 Sport Ave', 0, 'jane.smith@example.com'),
    ('Art Exhibition', 40, 'Exhibition', '789 Art Rd', 0, 'alice.jones@example.com'),
    ('Chess Tournament', 30, 'Competition', '789 Chess St', 0, 'mike.jordan@example.com');

-- Insert into volunteers table (Ensure emails exist in person)
INSERT INTO volunteers (v_roles, p_email, v_eventName)
VALUES 
    ('Organizer', 'mike.jordan@example.com', "Hackathon"),
    ('Coordinator', 'john.doe@example.com', "Chess Tournament");

-- Insert into club_member table (Ensure cm_name exists in person and cm_clubname exists in club)
INSERT INTO club_member (cm_clubname, cm_name)
VALUES 
    ('Tech Club', 'John Doe'),
    ('Tech Club', 'Jane Smith'),
    ('Sports Club', 'Alice Jones'),
    ('Chess Club', 'Mike Jordan');

INSERT INTO event_attendees (ea_event_name, ea_person_email)
VALUES
    ('Hackathon', 'john.doe@example.com'),
    ('Football Match', 'jane.smith@example.com'),
    ('Art Exhibition', 'alice.jones@example.com'),
    ('Chess Tournament', 'mike.jordan@example.com');

-- Insert into interest_group table
INSERT INTO interest_group (ig_name, ig_main_activity, ig_num_members)
VALUES 
    ('Coding Club', 'Programming', 40),
    ('Painting Club', 'Art', 25);

-- Insert into interest_group_member table (Ensure igm_name exists in person and igm_interest_group_name exists in interest_group)
INSERT INTO interest_group_member (igm_name, igm_interest_group_name)
VALUES 
    ('John Doe', 'Coding Club'),
    ('Jane Smith', 'Painting Club');



-- Events Section
-- Volunteer for an event
-- This query inserts a new volunteer for a specific event
INSERT OR IGNORE INTO volunteers (v_roles, p_email)
VALUES ('Volunteer', 'user@example.com');


--DONE
-- Login
-- grabs from persons table
SELECT p_email, p_name 
FROM person 
WHERE p_email = ? AND p_password = ?


--DONE
-- adds Voulenteer to database
SELECT 1 
FROM events 
WHERE e_name = ?
SELECT 1 
FROM volunteers 
WHERE p_email = ? 
AND v_eventName = ?
UPDATE events SET e_numVolunteers = e_numVolunteers + 1 WHERE e_name = ?
INSERT INTO volunteers (v_roles, p_email, v_eventName) VALUES (?, ?, ?)

--DONE
-- Unenrolls and removes Voulenteer to database
SELECT 1 
FROM events 
WHERE e_name = ?
UPDATE events SET e_numVolunteers = e_numVolunteers - 1 WHERE e_name = ?
DELETE FROM volunteers WHERE p_email = ? AND v_eventName = ?

--DONE
-- Gets all tuples from club table
SELECT c_name, c_address, c_meeting_times, c_num_members 
FROM club

--DONE
-- inserts into events table
INSERT INTO events (e_name, e_type, e_numattending, e_address, e_numVolunteers, e_creatorEmail) VALUES (?, ?, ?, ?, ?, ?)

--DONE
-- displays into the events table
SELECT e_name, e_type, e_numattending, e_address, e_numVolunteers 
FROM events

--DONE
-- Puts things into Club table
INSERT INTO club (c_name, c_address, c_meeting_times, c_num_members)
VALUES (?, ?, ?, ?)

--DONE
-- Updates the Clubs table for people who decide to join the club
SELECT 1 
FROM club_member 
WHERE cm_clubname = ? 
AND cm_name = ?
INSERT INTO club_member (cm_clubname, cm_name) VALUES (?, ?)
UPDATE club SET c_num_members = c_num_members + 1 WHERE c_name = ?

-- DONE
-- Displays all club members
SELECT cm_name 
FROM club_member 
WHERE cm_clubname = ?

-- DONE
-- Displays all elements in friend group table
SELECT fg_gcname, fg_num_members 
FROM friend_groups

-- DONE
-- Updates the friendgroup database table when someone joins the friend groups
SELECT 1 
FROM friend_group_member 
WHERE fg_member_name = ?
SELECT 1 
FROM friend_groups 
WHERE fg_gcname = ?
INSERT INTO friend_group_member (fg_name, fg_member_name) VALUES (?, ?)
UPDATE friend_groups SET fg_num_members = fg_num_members + 1 WHERE fg_gcname = ?

--DONE
-- Lists all interest Groups
SELECT ig_name, ig_main_activity, ig_num_members 
FROM interest_group

-- DONE
-- Updates data in interest group when a person joins
SELECT 1 
FROM interest_group 
WHERE ig_name = ?
INSERT INTO interest_group_member (igm_interest_group_name, igm_name) VALUES (?, ?)
UPDATE interest_group SET ig_num_members = ig_num_members + 1 WHERE ig_name = ?

-- DONE
-- Lists even attendees
SELECT ea_person_email
FROM event_attendees
WHERE ea_event_name = ?

-- DONE
-- Updates events when a person registers
SELECT 1 
FROM events 
WHERE e_name = ?
SELECT 1 
FROM person 
WHERE p_email = ?
SELECT 1 
FROM event_attendees 
WHERE ea_event_name = ? 
AND ea_person_email = ?
INSERT INTO event_attendees (ea_event_name, ea_person_email) VALUES (?, ?)
UPDATE events SET e_numattending = e_numattending + 1 WHERE e_name = ?

-- DONE 
-- Create a interest group
INSERT INTO interest_group (ig_name, ig_main_activity, ig_num_members)
VALUES (?, ?, ?)

-- DONE
-- Creates Friend Group
SELECT 1 
FROM friend_groups 
WHERE fg_gcname = ?
INSERT INTO friend_groups (fg_gcname, fg_num_members) VALUES (?, ?)
