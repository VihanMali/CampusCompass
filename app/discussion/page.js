"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function ChatArena() {
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState();
  const [messages, setMessages] = useState([]);

  async function GetMsg() {
    const response = await fetch("/api/chat");
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const text = await response.text();
    if (!text) { setMessages([]); return; }
    setMessages(JSON.parse(text));
  }

  useEffect(() => {
    const words = ["Anonymous", "Guest", "Shadow", "Explorer", "Legend"];
    const randomItem = words[Math.floor(Math.random() * words.length)];
    setUsername(randomItem + parseInt(Math.random() * (999 - 1) + 1));

    GetMsg();
    const interval = setInterval(GetMsg, 3000);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!msg.trim()) return;

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msg, username }),
    });

    setMsg("");
    await GetMsg();
  }

  return (
    <div className={styles.chatLayout}>
      <div className={styles.title}>
        <h1>College Discussion Hub</h1>
      </div>

      <div className={styles.userInfo}>
        You are <span>{username}</span>
      </div>

      <ul className={styles.messageContainer}>
        {messages.map((m) => {
          const isOwn = m.username === username;
          return (
            <li
              key={m.id}
              className={`${styles.messageBubble} ${isOwn ? styles.ownMessage : ""}`}
            >
              <div className={`${styles.messageAuthor} ${isOwn ? styles.ownAuthor : ""}`}>
                {m.user}
              </div>
              <span className={styles.messageText}>{m.msg}</span>
            </li>
          );
        })}
      </ul>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Message..."
          className={styles.inputField}
        />
        <button type="submit" className={styles.send}>Send</button>
      </form>
    </div>
  );
}