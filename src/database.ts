import Database from "better-sqlite3";
import "dotenv/config";

const db = new Database(process.env.DATABASE_URL || "database.db");

db.exec(
    `CREATE TABLE IF NOT EXISTS ninjas(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    rank TEXT NOT NULL
    )`
);

export default db;
