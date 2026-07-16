import os
from cs50 import SQL
from flask import Flask, request, jsonify

app = Flask(__name__)

#makes it so that this script can run from anywhere you don't have to cd to it's folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "chat.db")

#opening the database for operations to be done on it
db = SQL(f"sqlite:///{DB_PATH}")


def init_db():
    """Run once at startup: create the chats table if it doesn't exist yet."""
    with open(os.path.join(BASE_DIR, "schema.sql")) as f:
        for statement in f.read().split(";"):
            statement = statement.strip()
            if statement:
                db.execute(statement)


@app.route("/api/chat", methods=["GET"])
def get_chat(): 
    chats = db.execute(
        "SELECT id, username, msg, created_at FROM chats ORDER BY id ASC"
    )
    return jsonify(chats)
# Browser (frontend JS, e.g. fetch('/api/chat'))
#    ↓
# Next.js route handler (app/api/chat/route.js)
#    ↓  fetch("http://127.0.0.1:5000/api/chat")
# Flask server (get_chat())
#    ↓  jsonify(chats)  ← returns here
# Next.js route handler (receives it as `data`)
#    ↓  Response.json(data, ...)
# Browser (receives the final JSON)


@app.route("/api/chat", methods=["POST"])
def post_chat():
    body = request.get_json()

    if not body or not body.get("msg", "").strip() or not body.get("username", "").strip():
        return jsonify({"error": "username and msg are required"}), 400

    db.execute(
        "INSERT INTO chats (username, msg) VALUES (?, ?)",
        body["username"],
        body["msg"],
    )

    return jsonify({"success": True})

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)