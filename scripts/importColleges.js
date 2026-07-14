import fs from 'fs';
import db from '../db/index.js';

const colleges = JSON.parse(fs.readFileSync('./public/data/colleges.json', "utf-8"));

const insertCollege = db.prepare(`
   INSERT INTO colleges (
        id,
        name,
        short_name,
        city,
        state,
        type,
        website,
        description,
        center_lat,
        center_lng
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertCourse = db.prepare(`
    INSERT INTO courses (
        college_id,
        course_name
    )
        VALUES(?, ?)
`);

const importdata = db.transaction(() => {
    for (const college of colleges) {
        insertCollege.run(
            college.id,
            college.name,
            college.shortName,
            college.city,
            college.state,
            college.type,
            college.website,
            college.description,
            college.center.lat,
            college.center.lng
        );

        for (const course of college.courses) {
            insertCourse.run(
                college.id,
                course
            );
        }
    }
});

importdata();

console.log(`Imported ${colleges.length} colleges`);