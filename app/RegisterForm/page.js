"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterAndLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // STEP 1: Create the account via your custom backend route
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong during registration.");
      }

      // STEP 2: The registration succeeded! Auto-login the user immediately.
      const loginResult = await signIn("credentials", {
        username,
        password,
        redirect: false, // Prevent hard reloads
        callbackUrl: "/chat",
      });

      if (loginResult?.error) {
        setErrorMessage("Account created, but automatic login failed. Please sign in manually.");
      } else if (loginResult?.url) {
        router.push(loginResult.url);
        router.refresh(); // Sync the session cookie state with server components
      }

    } catch (err) {
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleRegisterAndLogin}>
        <h2>Create Account</h2>

        {errorMessage && (
          <div style={{ padding: "10px", backgroundColor: "#ffdee0", color: "#cc0000", marginBottom: "15px", borderRadius: "4px" }}>
            {errorMessage}
          </div>
        )}

        <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} required />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Register & Sign In"}
        </button>
      </form>
    </div>
  );
}
