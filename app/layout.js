import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "SSC CGL Prep — Mocks, Sectional & Topic Tests, Daily CA & Vocab",
  description:
    "Complete SSC CGL Tier-1 preparation platform: 25 full-length mocks, 50 sectional tests, topic-wise practice (200 Qs each), daily PIB current affairs and daily vocabulary with date-wise PDF downloads, plus login & performance analytics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          <main className="container">{children}</main>
          <footer className="container footer">
            SSC CGL Prep • Built per the latest SSC CGL 2025 notification pattern (Tier-1: 100 Q, 200 marks, 60 min, 0.5 negative).
            Always cross-check facts & dates with the official site{" "}
            <a href="https://ssc.gov.in" style={{ color: "var(--brand2)" }}>ssc.gov.in</a>.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
