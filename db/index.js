import Database from 'better-sqlite3';

const db = new Database('db/college.db', { 
    verbose: console.log 
});

// Enable FOREIGN KEYs
db.pragma('foreign_keys = ON');

export default db;