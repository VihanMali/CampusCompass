import db from './index.js';
import fs from 'fs';

const schema = fs.readFileSync('./db/schema.sql', "utf-8");

db.exec(schema);

console.log("Database initialized...");