import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

export default function ExternalRelations() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const [cards, setCards] = useState([
    {
      id: crypto.randomUUID(),
      name: "Partnerships",
      img: "/Folder.svg",
      to: "/external-relations/partnerships",
      hue: "linear-gradient(135deg,#eef3ff,#e0f2fe)",
      accent: "#2563eb",
    },
    {
      id: crypto.randomUUID(),
      name: "Sponsors & Offers",
      img: "/Calendar.svg",
      to: "/external-relations/sponsors",
      hue: "linear-gradient(135deg,#fff7ed,#ffedd5)",
      accent: "#f97316",
    },
    {
      id: crypto.randomUUID(),
      name: "Media & Outreach",
      img: "/Pencil.svg",
      to: "/external-relations/media",
      hue: "linear-gradient(135deg,#fef2ff,#e9d5ff)",
      accent: "#7c3aed",
    },
    {
      id: crypto.randomUUID(),
      name: "Contracts & Guidelines",
      img: "/security.svg",
      to: "/external-relations/guidelines",
      hue: "linear-gradient(135deg,#fef2f2,#fee2e2)",
      accent: "#dc2626",
    },
  ]);

  const filtered = useMemo(() => {
    const base = query.trim()
      ? cards.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase())
        )
      : cards;
    if (filter === "all") return base;
    return base;
  }, [cards, query, filter]);

  const createFolder = () => {
    const name = prompt("Folder name?");
    if (!name?.trim()) return;
    setCards((prev) => [
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        img: "/Folder.svg",
        to: "#",
        hue: "linear-gradient(135deg,#eef3ff,#e0f2fe)",
        accent: "#2563eb",
      },
      ...prev,
    ]);
  };

  const renameFolder = (id) => {
    const name = prompt("Rename to?");
    if (!name?.trim()) return;
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: name.trim() } : c))
    );
  };

  const removeFolder = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <main
      style={{
        flex: 1,
        height: "100%",
        minHeight: "100vh",
        background: "#f9fafb",
        overflow: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "24px 24px 40px",
          boxSizing: "border-box",
        }}
      >
        {/* About section */}
        <section style={{ marginBottom: 18 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 800,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            About External Relations
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 13,
              color: "#6b7280",
              lineHeight: 1.6,
              maxWidth: 760,
            }}
          >
            The External Relations Department manages GDG Algiers&apos; links
            with partners, sponsors, universities, companies, and media. They
            secure strategic collaborations, negotiate support for events, and
            ensure that every interaction reflects the values and professionalism
            of the community. By building long-term relationships, they create
            opportunities that help all departments grow and deliver more impact.
          </p>
        </section>

        {/* Search + filter + create */}
        <Toolbar
          query={query}
          setQuery={setQuery}
          filter={filter}
          setFilter={setFilter}
          onCreate={createFolder}
        />

        {/* Folders */}
        <SectionGrid
          title="your folders"
          cards={filtered}
          renameFolder={renameFolder}
          removeFolder={removeFolder}
        />
      </div>
    </main>
  );
}

/* === Shared UI (kept identical to other departments for consistent appearance) === */

function Toolbar({ query, setQuery, filter, setFilter, onCreate }) {
  return (
    <section
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <div style={{ flex: 1, position: "relative" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search"
          style={{
            width: "100%",
            padding: "12px 40px 12px 14px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            fontSize: 14,
            outline: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.65,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="#111827"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
              stroke="#111827"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            fontSize: 14,
            outline: "none",
          }}
        >
          <option value="all">Filter</option>
        </select>
      </div>

      <button
        onClick={onCreate}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderRadius: 999,
          border: "1px solid #e5e7eb",
          background: "#facc15",
          fontWeight: 800,
          fontSize: 13,
          cursor: "pointer",
          boxShadow: "0 6px 16px rgba(0,0,0,0.10)",
        }}
      >
        create folder
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: 20,
            height: 20,
            borderRadius: "999px",
            background: "#111827",
            color: "#ffffff",
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          +
        </span>
      </button>
    </section>
  );
}

function SectionGrid({ title, cards, renameFolder, removeFolder }) {
  return (
    <>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 800,
          margin: "10px 0 14px",
          color: "#0f172a",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 24,
        }}
      >
        {cards.map((c) => (
          <Tile
            key={c.id}
            name={c.name}
            img={c.img}
            to={c.to}
            hue={c.hue}
            accent={c.accent}
            onRename={() => renameFolder(c.id)}
            onDelete={() => removeFolder(c.id)}
          />
        ))}
      </div>
    </>
  );
}

function Tile({ name, img, to, hue, accent = "#111827", onRename, onDelete }) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current || !btnRef.current) return;
      if (
        menuRef.current.contains(e.target) ||
        btnRef.current.contains(e.target)
      )
        return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const actions = [
    { key: "rename", label: "Rename", onClick: onRename },
    { key: "add", label: "add to your library", onClick: () => {} },
    {
      key: "download",
      label: "download",
      onClick: () => {
        const a = document.createElement("a");
        a.href = img;
        a.download = img.split("/").pop() || "asset.svg";
        document.body.appendChild(a);
        a.click();
        a.remove();
      },
    },
    { key: "delete", label: "delete", onClick: onDelete },
  ];

  const handleDotsClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen((v) => !v);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        height: 180,
        borderRadius: 18,
        background: hue,
        border: "1px solid #ebeef4",
        overflow: "hidden",
        boxShadow: hover
          ? "0 14px 30px rgba(15,23,42,0.16)"
          : "0 8px 22px rgba(15,23,42,0.10)",
        transition: "box-shadow 160ms ease, transform 160ms ease",
        transform: hover ? "translateY(-2px)" : "none",
        cursor: to && to !== "#" ? "pointer" : "default",
      }}
      aria-label={`${name} tile`}
      title={name}
    >
      {to && to !== "#" && (
        <NavLink
          to={to}
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            textDecoration: "none",
            outline: "none",
          }}
        />
      )}

      <img
        src={img}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 26,
          top: 32,
          width: 50,
          height: 50,
          objectFit: "contain",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <button
        ref={btnRef}
        onClick={handleDotsClick}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More options"
        style={{
          position: "absolute",
          left: 86,
          top: 36,
          width: 30,
          height: 30,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          outline: "none",
          boxShadow: hover
            ? "0 4px 14px rgba(15,23,42,0.16)"
            : "0 2px 8px rgba(15,23,42,0.08)",
          zIndex: 3,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          style={{
            position: "absolute",
            left: 86,
            top: 72,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            boxShadow: "0 10px 28px rgba(15,23,42,0.15)",
            padding: 6,
            minWidth: 180,
            zIndex: 4,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {actions.map((a) => (
            <button
              key={a.key}
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                a.onClick?.();
                setOpen(false);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "9px 12px",
                borderRadius: 10,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 14,
                color: a.key === "delete" ? "#e11d48" : "#111827",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(0,0,0,.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 26,
          bottom: 22,
          fontSize: 20,
          fontWeight: 700,
          color: accent,
          zIndex: 1,
        }}
      >
        {name}
      </div>
    </div>
  );
}
