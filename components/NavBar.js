"use client";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function NavBar() {
  const { user, logout, ready } = useAuth();
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="logo">
          <span className="dot" /> SSC CGL <span style={{ color: "var(--brand2)" }}>Prep</span>
        </Link>
        <nav className="nav-links">
          <Link href="/mocks">Full Mocks</Link>
          <Link href="/sectional">Sectional</Link>
          <Link href="/topics">Topic-wise</Link>
          <Link href="/current-affairs">Current Affairs</Link>
          <Link href="/vocabulary">Vocabulary</Link>
          <Link href="/exam-info">Exam Info</Link>
          {ready && user ? (
            <>
              <Link href="/dashboard" className="active">📊 Dashboard</Link>
              <a onClick={logout} style={{ cursor: "pointer" }} title={user.email}>Logout ({user.name.split(" ")[0]})</a>
            </>
          ) : (
            <Link href="/login" className="active">Login / Sign up</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
