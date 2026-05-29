"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { loginUser, registerUser } from "@/lib/store";

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const session = mode === "login"
        ? await loginUser(email.trim(), password)
        : await registerUser(name.trim() || "Aspirant", email.trim(), password);
      setUser(session);
      router.push("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="qbox" style={{ maxWidth: 440, margin: "50px auto" }}>
      <div className="kicker">{mode === "login" ? "Welcome back" : "Create your account"}</div>
      <h1 className="h1" style={{ marginTop: 6 }}>{mode === "login" ? "Login" : "Sign up"}</h1>
      <p className="sub" style={{ marginTop: 0 }}>Track your mocks, see analytics, and find your weak topics.</p>
      <form onSubmit={submit} style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {mode === "signup" && (
          <div>
            <label className="tiny muted">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
        )}
        <div>
          <label className="tiny muted">Email</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="tiny muted">Password</label>
          <input className="input" type="password" required minLength={4} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
        </div>
        {err && <div className="badge red" style={{ padding: "8px 12px" }}>{err}</div>}
        <button className="btn" disabled={busy} type="submit">{busy ? "Please wait…" : mode === "login" ? "Login" : "Create account"}</button>
      </form>
      <div style={{ marginTop: 14, textAlign: "center" }}>
        <button className="btn ghost sm" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErr(""); }}>
          {mode === "login" ? "New here? Create an account" : "Already have an account? Login"}
        </button>
      </div>
      <p className="tiny muted" style={{ marginTop: 18 }}>
        Note: accounts &amp; progress are stored locally in this browser/device. For multi-device sync, connect a backend
        (see README — Supabase/Postgres adapter).
      </p>
    </div>
  );
}
