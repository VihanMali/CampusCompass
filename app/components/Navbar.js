"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HomeIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M3 12L12 3l9 9" /><path d="M9 21V12h6v9" /><path d="M3 12v9h18v-9" strokeOpacity="0" />
  </svg>
);
const CollegesIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M12 3L2 8l10 5 10-5-10-5z" /><path d="M2 8v8" /><path d="M22 8v8" /><path d="M6 10.5V17a6 6 0 0012 0v-6.5" />
  </svg>
);
const HubIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const navItems = [
  { name: "Home", href: "/", Icon: HomeIcon },
  { name: "Colleges", href: "/colleges", Icon: CollegesIcon },
  { name: "Hub", href: "/discussion", Icon: HubIcon },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={nav}>
      <ul style={navList}>
        {navItems.map(({ name, href, Icon }) => {
          const active = pathname === href;
          return (
            <li key={name} style={navItem}>
              <Link href={href} style={{ ...navLink, color: active ? "#38bdf8" : "#4a5568" }}>
                <span style={{ ...iconWrap, filter: active ? "drop-shadow(0 0 6px #38bdf8)" : "none" }}>
                  <Icon />
                </span>
                <span style={{ ...text, fontWeight: active ? 700 : 400 }}>{name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const nav = { position: "fixed", bottom: 0, left: 0, width: "100%", backgroundColor: "#030029", borderTop: "1px solid rgba(56,189,248,0.1)", zIndex: 1000, padding: "8px 0 10px" };
const navList = { display: "flex", justifyContent: "space-around", alignItems: "center", listStyle: "none", margin: 0, padding: 0 };
const navItem = { textAlign: "center", flex: 1 };
const navLink = { display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", fontSize: "11px", gap: "3px", transition: "color 0.2s" };
const iconWrap = { display: "flex", transition: "filter 0.2s" };
const text = { letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "10px" };