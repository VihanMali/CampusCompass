-- basic info about the college
CREATE TABLE IF NOT EXISTS colleges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    city TEXT,
    state TEXT,
    type TEXT,
    website TEXT,
    description TEXT,

    center_lat REAL NOT NULL,
    center_lng REAL NOT NULL  
);

-- couses offered by each college
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT NOT NULL,
    college_id TEXT NOT NULL,

    UNIQUE(college_id, course_name),

    FOREIGN KEY(college_id)
        REFERENCES colleges(id)
        ON DELETE CASCADE
);

-- campus boundary ploygon stored as JSON array
CREATE TABLE IF NOT EXISTS campus_boundary (
    college_id TEXT PRIMARY KEY,
    boundary TEXT NOT NULL,

    FOREIGN KEY(college_id)
        REFERENCES colleges(id)
        ON DELETE CASCADE
);

-- places inside the college (library/ auditorium etc)
CREATE TABLE IF NOT EXISTS campus_places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    college_id TEXT NOT NULL,

    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,

    FOREIGN KEY(college_id)
        REFERENCES colleges(id)
        ON DELETE CASCADE
);