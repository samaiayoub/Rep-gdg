import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ items, favCount, filter, setFilter }) {
  return (
    <aside
      aria-label="Sidebar"
      style={{
        width: 280,
        flex: "0 0 auto",
        height: "100%",
        background: "#fff",
        borderRight: "1px solid #eee",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "20px 16px 8px 16px" }}>
        <NavLink to="/" style={{ display: "inline-block", lineHeight: 0 }} aria-label="Go to main hub">
          <img src="/GDG Algiers Logo.svg" alt="GDG Algiers" style={{ width: 170, height: "auto", cursor: "pointer" }} />
        </NavLink>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginLeft: 16 }}>Departments</div>

      <nav aria-label="Departments" style={{ marginTop: 8, padding: "0 12px", overflowY: "auto", flex: 1 }}>
        {items.map((it) => {
          const isFav = it.special === "favorites";
          const isActive = isFav && filter === "favorites";
          const inner = (
            <>
              <img
                src={it.icon}
                alt=""
                aria-hidden
                style={{ width: 18, height: 18, objectFit: "contain", display: "block" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.parentElement.querySelector("span[data-fallback]");
                  if (fallback) fallback.style.display = "inline-block";
                }}
              />
              <span data-fallback style={{ display: "none", width: 18, height: 18, borderRadius: 999, border: "2px solid #111" }} />
              <span>{it.label}</span>
              {isFav && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "rgba(66,133,244,.10)",
                    border: "1px solid rgba(66,133,244,.18)",
                  }}
                  aria-label={`${favCount} favorite folders`}
                >
                  {favCount}
                </span>
              )}
            </>
          );

          return isFav ? (
            <button
              key={it.to}
              onClick={() => setFilter("favorites")}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 10px",
                marginBottom: 6,
                borderRadius: 10,
                border: isActive ? "1px solid rgba(66,133,244,.18)" : "1px solid #eee",
                background: isActive ? "rgba(66,133,244,.08)" : "#fff",
                fontWeight: 700,
                color: "#111",
                cursor: "pointer",
                outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(66,133,244,.35)")}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              aria-pressed={isActive}
            >
              {inner}
            </button>
          ) : (
            <NavLink
              key={it.to}
              to={it.to}
              style={({ isActive }) => ({
                textDecoration: "none",
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 10px",
                marginBottom: 6,
                borderRadius: 10,
                border: isActive ? "1px solid rgba(66,133,244,.18)" : "1px solid #eee",
                background: isActive ? "rgba(66,133,244,.08)" : "#fff",
                color: "#111",
                fontWeight: 500,
              })}
            >
              {inner}
            </NavLink>
          );
        })}
      </nav>

      <div style={{ borderTop: "1px solid #eee", padding: 12, display: "grid", gap: 10 }}>
        <button
          style={{
            textAlign: "left",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #eee",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 500,
            outline: "none",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(66,133,244,.35)")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          ⚙️ Account & billing
        </button>
        <button
          style={{
            textAlign: "left",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #eee",
            background: "#fff",
            color: "#e11d48",
            cursor: "pointer",
            fontWeight: 600,
            outline: "none",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(66,133,244,.35)")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          ⎋ Log out
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e5e7eb" }} />
          <div style={{ lineHeight: 1.2, minWidth: 0 }}>
            <div style={{ fontWeight: 600 }}>user</div>
            <div style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>
              Google • ////@gmail.com
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
