"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var better_sqlite3_1 = require("better-sqlite3");
var db = new better_sqlite3_1.default("database.db");
db.exec("\n    CREATE TABLE IF NOT EXISTS ninjas(\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    nome TEXT NOT NULL,\n    rank TEXT NOT NULL\n    )\n\n    ");
exports.default = db;
