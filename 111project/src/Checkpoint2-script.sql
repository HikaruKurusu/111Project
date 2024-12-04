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
INSERT INTO person (p_email, p_name, p_phonenumber)
VALUES 
    ('john.doe@example.com', 'John Doe', 1234567890),
    ('jane.smith@example.com', 'Jane Smith', 9876543210),
    ('alice.jones@example.com', 'Alice Jones', 4561237890),
    ('mike.jordan@example.com', 'Mike Jordan', 1122334455);

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

-- Insert into locations table
INSERT INTO locations (l_address, l_name)
VALUES 
    ('123 Tech St', 'Tech Hall'),
    ('456 Sport Ave', 'Gymnasium'),
    ('789 Art Rd', 'Art Gallery'),
    ('789 Chess St', 'Chess Hall');

-- Insert into events table
INSERT INTO events (e_name, e_numattending, e_type, e_address)
VALUES 
    ('Hackathon', 100, 'Competition', '123 Tech St'),
    ('Football Match', 50, 'Game', '456 Sport Ave'),
    ('Art Exhibition', 40, 'Exhibition', '789 Art Rd'),
    ('Chess Tournament', 30, 'Competition', '789 Chess St');

-- Insert into volunteers table (Ensure emails exist in person)
INSERT INTO volunteers (v_roles, p_email)
VALUES 
    ('Organizer', 'mike.jordan@example.com'),
    ('Coordinator', 'john.doe@example.com');

-- Insert into club_member table (Ensure cm_name exists in person and cm_clubname exists in club)
INSERT INTO club_member (cm_clubname, cm_name)
VALUES 
    ('Tech Club', 'John Doe'),
    ('Tech Club', 'Jane Smith'),
    ('Sports Club', 'Alice Jones'),
    ('Chess Club', 'Mike Jordan');

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

    
--------------------------------------------------------------------------------


-- Events Section
-- Volunteer for an event
-- This query inserts a new volunteer for a specific event
INSERT OR IGNORE INTO volunteers (v_roles, p_email)
VALUES ('Volunteer', 'user@example.com');

-- Join an event
-- This query updates the number of attendees for a specific event
UPDATE events
SET e_numattending = e_numattending + 1
WHERE e_name = 'Hackathon';

-- Host an event
-- This query inserts a new event into the events table
INSERT OR IGNORE INTO events (e_name, e_numattending, e_type, e_address)
VALUES ('New Event', 0, 'Workshop', '123 New St');

-- Specify event location
-- This query inserts a new location for an event
INSERT OR IGNORE INTO locations (l_address, l_name)
VALUES ('123 New St', 'New Event Hall');

-- List all events with more than 50 attendees
SELECT e_name, e_numattending, e_type, e_address
FROM events
WHERE e_numattending > 50;

-- Find all volunteers for a specific event
SELECT v.p_email, v.v_roles
FROM volunteers v
JOIN events e ON v.p_email = e.e_name
WHERE e.e_name = 'Hackathon';

-- Update the type of an event
UPDATE events
SET e_type = 'Conference'
WHERE e_name = 'Tech Meetup';

-- Delete an event
DELETE FROM events
WHERE e_name = 'Art Exhibition';

-- Clubs Section

-- Explore clubs
-- This query selects all clubs from the club table
SELECT * FROM club;

-- Join a club
-- This query inserts a new member into a club
INSERT OR IGNORE INTO club_member (cm_clubname, cm_name)
VALUES ('Tech Club', 'user@example.com');

-- Host a club
-- This query inserts a new club into the club table
INSERT OR IGNORE INTO club (c_name, c_address, c_meeting_times, c_num_members)
VALUES ('New Club', '456 New Ave', 'Wed 6:00 PM', 1);

-- List all clubs with their meeting times
SELECT c_name, c_meeting_times
FROM club;

-- Find all members of a specific club
SELECT cm_name
FROM club_member
WHERE cm_clubname = 'Tech Club';

-- Update the number of members in a club
UPDATE club
SET c_num_members = c_num_members + 1
WHERE c_name = 'Gaming Club';

-- Interest Groups Section

-- Connect with like-minded individuals
-- This query selects all members of a specific interest group
SELECT p.p_name, p.p_email
FROM person p
JOIN interest_group_member igm ON p.p_name = igm.igm_name
WHERE igm.igm_interest_group_name = 'Coding Club';

-- Create a friend group
-- This query inserts a new friend group into the friend_group table
INSERT OR IGNORE INTO friend_group (fg_groupchatname, fg_nummembers)
VALUES ('New Friends', 0);

-- Plan meetups at various locations
-- This query selects all locations and the events happening at each location
SELECT l.l_name, l.l_address, e.e_name, e.e_type
FROM locations l
LEFT JOIN events e ON l.l_address = e.e_address;

-- List all interest groups and their main activities
SELECT ig_name, ig_main_activity
FROM interest_group;

-- Find all members of a specific interest group
SELECT igm_name
FROM interest_group_member
WHERE igm_interest_group_name = 'Painting Club';

-- Plan meetups at various locations
-- This query selects all locations
SELECT * FROM locations;