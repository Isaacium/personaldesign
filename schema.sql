CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL,
    username TEXT NOT NULL,
    score INTEGER NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(game_id, username)
);

CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    attending INTEGER NOT NULL, -- 1 for Yes, 0 for No
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brackets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rsvp_id INTEGER NOT NULL,
    bracket_data TEXT NOT NULL, -- JSON string storing tournament match picks
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rsvp_id) REFERENCES rsvps(id)
);

