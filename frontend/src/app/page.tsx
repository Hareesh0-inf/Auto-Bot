"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !apiKey) {
      setError("Both fields are required.");
      return;
    }

    try {
      const response = await fetch("https://autobot-cmar.onrender.com/store_api_key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "name":name,"api_key": apiKey }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Key stored successfully:", data);
            if (typeof window !== undefined) {
              window.sessionStorage.setItem("user_id",name);
              window.sessionStorage.setItem("api",apiKey);
            }
        router.push("/chat");
      } else {
        setError("Failed to store API key. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="background"></div>
      <h2>API Details</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apiKey">API Key</label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            required
          />
        </div>
        <button type="submit">Save</button>
      </form>
      <style jsx>{`
        .login-container {

          max-width: 400px;
          margin: 100px auto;
          padding: 20px;
          color: #000000;
          background-color: #d8d8d8;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          z-index: -1;
        }
        .background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgb(132,94,194);
          background: linear-gradient(16deg, rgba(132,94,194,1) 22%, rgba(0,201,167,1) 82%);
          z-index: -1;
        }
        h2 {
          text-align: center;
          align: center;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        input {
          width: 100%;
          padding: 10px;
          color: #000000;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #f5f5f5;
        }
        button {
          width: 100%;
          padding: 10px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #005bb5;
        }
        .error {
          color: red;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
}
