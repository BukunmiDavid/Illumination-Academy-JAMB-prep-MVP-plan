import sqlite3
from . import config

def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(config.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db() -> None:
    with get_conn() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS students (
                phone TEXT PRIMARY KEY,
                name TEXT, school TEXT, class_room TEXT,
                exam TEXT DEFAULT 'JAMB', subject TEXT,
                wa_state TEXT DEFAULT 'idle',
                created_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone TEXT, name TEXT, subject TEXT,
                score INTEGER, total INTEGER, answers_json TEXT,
                created_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS chats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone TEXT, role TEXT, content TEXT,
                created_at TEXT DEFAULT (datetime('now'))
            );
            """
        )