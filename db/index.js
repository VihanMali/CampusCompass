import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(
  path.join(process.cwd(), "db", "college.db"),
  { verbose: console.log }
);

// Enable FOREIGN KEYs
db.pragma('foreign_keys = ON');

export default db;