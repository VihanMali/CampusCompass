
import db from './index.js';


export function getColleges() {
    const stmt = db.prepare(`
        SELECT id, name, short_name FROM colleges
    `);

    const data = stmt.all();

    return data;
}


// getCollege(id)

// insertCollege(college)

// getBoundary(id)

// insertBoundary(id, boundary)