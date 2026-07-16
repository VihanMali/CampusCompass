"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
export default function ChatArena() {
  //what is this ??
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState();
  const [messages, setMessages] = useState([]);

  //GetMessage that the user typed in
  async function GetMsg() {
    const response = await fetch("/api/chat");
    //if some error happens in fetching the backend
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const text = await response.text();
    //check if text has something in it if not don't do anything
    if (!text) { setMessages([]); return; }
    //Put the text in the messages array thingy
    setMessages(JSON.parse(text));
  }

  useEffect(() => {
    const words = ["Anonymous", "Guest", "Shadow", "Explorer", "Legend"];
    const randomItem = words[Math.floor(Math.random() * words.length)];
    setUsername(randomItem + parseInt(Math.random() * (999 - 1) + 1));

    //used to set an interval between any 2 messages
    GetMsg();
    const interval = setInterval(GetMsg, 3000);
    return () => clearInterval(interval);
  }, []);

  //does it check if the user typed something?
  async function handleSubmit(e) {
    e.preventDefault();
    if (!msg.trim()) return;

    //Gives ChatBackend the msg typed by the user and username
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
                 {m.username} {/* <-- changed m.user to m.username */}
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