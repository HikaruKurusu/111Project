CREATE TABLE person (
    p_email VARCHAR(40) PRIMARY KEY,
    p_name VARCHAR(30) NOT NULL,
    p_phonenumber UNSIGNED INT NOT NULL,
    p_password VARCHAR(20) NOT NULL
);

CREATE TABLE club_member (
    cm_clubname VARCHAR(30) NOT NULL,
    cm_name VARCHAR(30) NOT NULL,
    FOREIGN KEY (cm_name) REFERENCES person(p_name),
    FOREIGN KEY (cm_clubname) REFERENCES club(c_name)
);

CREATE TABLE volunteers (
    v_roles VARCHAR(20) NOT NULL,
    p_email VARCHAR(40),
    v_isVolunteering BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (p_email) REFERENCES person(p_email)
);

CREATE TABLE locations (
    l_address VARCHAR(70) NOT NULL,
    l_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (l_address)
);

CREATE TABLE events (
    e_name VARCHAR(40) PRIMARY KEY,
    e_numattending UNSIGNED INT NOT NULL,
    e_type VARCHAR(15) NOT NULL,
    e_address VARCHAR(70) NOT NULL,
    e_numVolunteers UNSIGNED INT NOT NULL DEFAULT 0,
    e_creatorEmail VARCHAR(40) NOT NULL,
    FOREIGN KEY (e_address) REFERENCES locations(l_address)
);

CREATE TABLE club (
    c_name VARCHAR(30) NOT NULL,
    c_address VARCHAR(60) NOT NULL,
    c_meeting_times VARCHAR(50) NOT NULL,
    c_num_members UNSIGNED INT NOT NULL,
    PRIMARY KEY (c_name, c_address)
);

CREATE TABLE friend_groups (
    fg_gcname VARCHAR(20) PRIMARY KEY NOT NULL,
    fg_num_members UNSIGNED INT
);

CREATE TABLE interest_group (
    ig_name VARCHAR(30) PRIMARY KEY NOT NULL,
    ig_main_activity VARCHAR(40) NOT NULL,
    ig_num_members UNSIGNED INT
);

CREATE TABLE interest_group_member (
    igm_name VARCHAR(30) NOT NULL,
    igm_interest_group_name VARCHAR(30) NOT NULL,
    FOREIGN KEY (igm_name) REFERENCES person(p_name),
    FOREIGN KEY (igm_interest_group_name) REFERENCES interest_group(ig_name)
);
