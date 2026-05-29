"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function NavBar() {
  const { user, logout, ready } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="logo">
          <span className="dot" /> SSC CGL <span style={{ color: "var(--brand)" }}>Prep</span>
        </Link>
        <button className="nav-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link href="/mocks" onClick={() => setMenuOpen(false)}>Full Mocks</Link>
          <Link href="/sectional" onClick={() => setMenuOpen(false)}>Sectional</Link>
          <Link href="/topics" onClick={() => setMenuOpen(false)}>Topic-wise</Link>
          <Link href="/current-affairs" onClick={() => setMenuOpen(false)}>Current Affairs</Link>
          <Link href="/vocabulary" onClick={() => setMenuOpen(false)}>Vocabulary</Link>
          <Link href="/exam-info" onClick={() => setMenuOpen(false)}>Exam Info</Link>
          {ready && user ? (
            <>
              <Link href="/dashboard" className="active" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
              <button onClick={() => { setMenuOpen(false); logout(); }} style={{ cursor: "pointer", background: "none", border: "none", color: "var(--muted)", fontWeight: 600, padding: "8px 14px", textAlign: "left", fontSize: "14px" }} title={user.email}>
                Logout ({user.name.split(" ")[0]})
              </button>
            </>
          ) : (
            <Link href="/login" className="btn sm" style={{ marginLeft: "8px" }} onClick={() => setMenuOpen(false)}>Login / Sign up</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

