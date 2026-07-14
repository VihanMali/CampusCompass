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

// insertCollege(college)

// getBoundary(id)

// insertBoundary(id, boundary)