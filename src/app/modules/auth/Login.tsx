import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getLoginFormData, setLoginData, USERNAME_KEY } from "@/lib/authUtils.ts";

const API_LOGIN = "http://localhost:5000/api/auth/token";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const formData = getLoginFormData(username, password);

      const res = await axios.post(API_LOGIN, formData);
      const { access_token, refresh_token } = res.data;
      localStorage.setItem(USERNAME_KEY, username);
      setLoginData(access_token, refresh_token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: "100%" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%" }} />
        </div>
        {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
        <button type="submit" style={{ width: "100%" }}>Login</button>
      </form>
    </div>
  );
};

export default Login;