import db from './index.js';

export function getColleges() {
  const stmt = db.prepare(`
    SELECT id, name, short_name FROM colleges
  `);

  const data = stmt.all();

  return data;
}

// TODO: if the id is invalid?
// get college info + courses from id
export function getCollege(id) {
  const college = db.prepare(`
    SELECT * 
    FROM colleges
    WHERE id = ?   
  `).get(id);

  if (!college) return null;

  const courses = db.prepare(`
    SELECT id, course_name
    FROM courses
    WHERE college_id = ?
  `).all(id);

  college.courses = courses;

  return college;
}

export function getCollegeMapData(id) {
  const boundary = db.prepare(`
    SELECT boundary
    FROM campus_boundary
    WHERE college_id = ? 
  `).get(id);

  if (!boundary) return null;

  const campusPlaces = db.prepare(`
    SELECT id, name, latitude, longitude
    FROM campus_places
    WHERE college_id = ?
  `).all(id);

  return {
    boundary: JSON.parse(boundary.boundary),
    campusPlaces
  }
}


// insertCollege(college)


// insertBoundary(id, boundary)