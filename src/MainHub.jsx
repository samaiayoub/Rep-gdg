import React, { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";

export default function MainHub() {
  const SIDEBAR_WIDTH = 280;

  const CONFIG = useMemo(
    () => ({
      bg: "#ffffff",
      colors: { red: "#ea4335", blue: "#4285f4", green: "#34a853", yellow: "#fbbc04", ink: "#0f172a" },
    }),
    []
  );

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [draftHue, setDraftHue] = useState(145);

  const hueOptions = [
    { label: "red", deg: 145 },
    { label: "blue", deg: 0 },
    { label: "yellow", deg: -40 },
    { label: "green", deg: -95 },
  ];

  const [folders, setFolders] = useState([
    { id: crypto.randomUUID(), name: "design guides", hue: 0, projects: 20, favorite: true },
    { id: crypto.randomUUID(), name: "Poster Template", hue: -40, projects: 10, favorite: false },
    { id: crypto.randomUUID(), name: "comm guides", hue: -95, projects: 10, favorite: false },
    { id: crypto.randomUUID(), name: "naima", hue: 145, projects: 10, favorite: true },
  ]);

  const favCount = folders.filter((f) => f.favorite).length;
  const [filter, setFilter] = useState("all");

  const items = [
    { label: "Favorites", to: "/favorites", icon: "/heart.png", special: "favorites" },
    { label: "Design", to: "/design", icon: "/design.png" },
    { label: "Development", to: "/development", icon: "/code-xml.png" },
    { label: "Communication", to: "/communication", icon: "/message-square-text.png" },
    { label: "Human Resources", to: "/human-resources", icon: "/users-round.png" },
    { label: "Logistics", to: "/logistics", icon: "/calendar-1.png" },
    { label: "Multimedia", to: "/multimedia", icon: "/camera.png" },
    { label: "External Relations", to: "/external-relations", icon: "/dollar-sign.png" },
  ];

  const openCreate = () => {
    setDraftName("");
    setDraftHue(145);
    setShowCreate(true);
  };
  const saveCreate = () => {
    if (!draftName.trim()) return;
    setFolders((f) => [{ id: crypto.randomUUID(), name: draftName.trim(), hue: draftHue, projects: 0, favorite: false }, ...f]);
    setShowCreate(false);
  };
  const openEdit = (folder) => {
    setDraftName(folder.name);
    setDraftHue(folder.hue);
    setShowEdit(folder.id);
  };
  const saveEdit = () => {
    setFolders((f) => f.map((x) => (x.id === showEdit ? { ...x, name: draftName.trim() || x.name, hue: draftHue } : x)));
    setShowEdit(null);
  };
  const toggleFav = (id) => {
    setFolders((f) => f.map((x) => (x.id === id ? { ...x, favorite: !x.favorite } : x)));
  };

  const isMember = true;
  function handleAddProject(folderId) {
    if (!isMember) {
      window.dispatchEvent(new CustomEvent("GDG:authRequired", { detail: { source: "createProject" } }));
      return;
    }
    window.dispatchEvent(new CustomEvent("GDG:createProject", { detail: { folderId, origin: "MainHub", ts: Date.now() } }));
    setFolders((f) => f.map((x) => (x.id === folderId ? { ...x, projects: x.projects + 1 } : x)));
  }

  const visibleFolders = folders.filter((f) => (filter === "favorites" ? f.favorite : true));

  const [recently, setRecently] = useState(
    Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: "Event feedback", text: "Used by the GDG team to collect feedback after events…" }))
  );
  const removeRecent = (id) => setRecently((r) => r.filter((x) => x.id !== id));

  const location = useLocation();
  const showHub = location.pathname === "/";

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: CONFIG.bg }}>
      <BackgroundStrings />

      <div style={{ position: "absolute", inset: 0, display: "flex", zIndex: 1 }}>
        <Sidebar items={items} favCount={favCount} filter={filter} setFilter={setFilter} />

        <main style={{ position: "relative", flex: 1, overflow: "auto" }}>
          <Outlet />
          {showHub && (
            <>
              <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "24px 20px 18px", textAlign: "center" }}>
                <img
                  src="/gdglogo.svg"
                  alt=""
                  aria-hidden="true"
                  style={{ position: "absolute", left: "50%", top: "54%", transform: "translate(-50%, -50%)", height: 200, width: "auto", opacity: 0.09, zIndex: 0, pointerEvents: "none", filter: "saturate(1.05)" }}
                />
                <h1 style={{ position: "relative", zIndex: 1, margin: "6px 0 6px", fontSize: 34, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.2px" }}>
                  GDG Resources Hub
                </h1>
                <div style={{ position: "relative", zIndex: 1, fontSize: 20, fontWeight: 700, marginBottom: 12, wordSpacing: "0.04em" }}>
                  <span style={{ color: CONFIG.colors.blue, letterSpacing: "0.02em" }}>Turn </span>
                  <span style={{ color: CONFIG.colors.red, letterSpacing: "0.02em" }}>Curiosity </span>
                  <span style={{ color: CONFIG.colors.yellow, letterSpacing: "0.02em" }}>Into Code</span>
                  <span style={{ color: "#0f172a" }}>, </span>
                  <span style={{ color: CONFIG.colors.green, letterSpacing: "0.02em" }}>Ideas </span>
                  <span style={{ color: CONFIG.colors.blue, letterSpacing: "0.02em" }}>Into Impact</span>
                </div>
                <div style={{ position: "relative", zIndex: 1, fontSize: 13, color: "#475569", marginBottom: 18 }}>Centralize. Share. Empower.</div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={openCreate}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 14px",
                      borderRadius: 999,
                      border: "1px solid #e5e7eb",
                      background: "#3b82f6",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 6px 18px rgba(59,130,246,0.25)",
                      outline: "none",
                    }}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(66,133,244,.35), 0 6px 18px rgba(59,130,246,0.25)")}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "0 6px 18px rgba(59,130,246,0.25)")}
                    aria-label="Add folder"
                  >
                    Add folder
                    <img src="/plus.png" alt="" aria-hidden style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>

              <section style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 20px 8px" }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 14px", color: "#0f172a", textAlign: "left" }}>
                  {filter === "favorites" ? "Your Favorites" : "Your Library"}
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 24 }}>
                  {visibleFolders.map((f) => (
                    <FolderTile
                      key={f.id}
                      name={f.name}
                      projects={f.projects}
                      hue={f.hue}
                      favorite={f.favorite}
                      onFav={() => toggleFav(f.id)}
                      onAdd={() => handleAddProject(f.id)}
                      onEdit={() => openEdit(f)}
                    />
                  ))}
                </div>
              </section>

              <section style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 60px" }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 14px", color: "#0f172a" }}>Recently Viewed</h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 24 }}>
                  {recently.map((r) => (
                    <RecentCard key={r.id} id={r.id} title={r.title} text={r.text} onRemove={removeRecent} />
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {(showCreate || showEdit) && (
        <Modal onClose={() => (showCreate ? setShowCreate(false) : setShowEdit(null))}>
          <CreateEditDialog
            mode={showCreate ? "create" : "edit"}
            draftName={draftName}
            setDraftName={setDraftName}
            draftHue={draftHue}
            setDraftHue={setDraftHue}
            hueOptions={hueOptions}
            onCancel={() => (showCreate ? setShowCreate(false) : setShowEdit(null))}
            onSave={() => (showCreate ? saveCreate() : saveEdit())}
          />
        </Modal>
      )}
    </div>
  );
}

function BackgroundStrings() {
  const svgRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const svg = svgRef.current;
    if (!svg) return;

    const update = (t) => {
      const dt = (t - t0) / 1000;
      const W = svg.clientWidth;
      const H = svg.clientHeight;

      const margin = 72;
      const start = { x: W + margin, y: -margin };
      const end = { x: -margin, y: H + margin };

      const baseBends = [220, 280, 340, 410];
      const amp = 14;
      const speed = 1.25;

      [...svg.querySelectorAll("path[data-wire]")].forEach((p, i) => {
        const bend = baseBends[i] + Math.sin(dt * speed + i * 0.9) * amp;
        const c1 = { x: start.x - bend * 1.2, y: start.y + bend * 1.55 };
        const c2 = { x: end.x + bend * 0.95, y: end.y - bend * 0.45 };
        p.setAttribute("d", `M ${start.x},${start.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${end.x},${end.y}`);
      });

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg ref={svgRef} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}>
      <defs>
        <filter id="soften" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>
      <g filter="url(#soften)">
        <path data-wire stroke="#4285f4" strokeWidth="10" strokeLinecap="round" fill="none" opacity=".42" />
        <path data-wire stroke="#ea4335" strokeWidth="10" strokeLinecap="round" fill="none" opacity=".38" />
        <path data-wire stroke="#34a853" strokeWidth="10" strokeLinecap="round" fill="none" opacity=".34" />
        <path data-wire stroke="#fbbc04" strokeWidth="10" strokeLinecap="round" fill="none" opacity=".30" />
      </g>
    </svg>
  );
}

function FolderTile({ name, projects, hue, favorite, onFav, onAdd, onEdit }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        height: 170,
        background: "transparent",
        borderRadius: 16,
        transition: "transform 160ms ease, filter 160ms ease",
        transform: hover ? "translateY(-2px) scale(1.01)" : "none",
        filter: hover ? "drop-shadow(0 20px 30px rgba(0,0,0,0.16))" : "drop-shadow(0 14px 22px rgba(0,0,0,0.12))",
        cursor: "default",
      }}
      title={name}
    >
      <img
        src="/fullfolder.svg"
        alt=""
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", filter: `hue-rotate(${hue}deg) saturate(1.12)`, pointerEvents: "none", zIndex: 0 }}
      />

      <div
        style={{
          position: "absolute",
          top: 10,
          right: 12,
          display: "flex",
          gap: 8,
          opacity: hover ? 1 : 0,
          transform: hover ? "translateY(0)" : "translateY(-4px)",
          transition: "opacity 160ms ease, transform 160ms ease",
          zIndex: 2,
        }}
      >
        <IconBtn title="Edit folder" onClick={onEdit} icon="/pencil.png" />
        <IconBtn title="Add project" onClick={onAdd} icon="/plus.png" />
        <IconBtn title={favorite ? "Remove from favorites" : "Add to favorites"} onClick={onFav} icon="/heart.png" active={favorite} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 10,
          right: 10,
          bottom: 10,
          height: 56,
          borderRadius: 14,
          background:
            "linear-gradient(180deg, rgba(255,255,255,.26) 0%, rgba(255,255,255,.18) 100%), radial-gradient(80% 100% at 50% 0%, rgba(255,255,255,.35), rgba(255,255,255,0))",
          backdropFilter: "blur(6px)",
          boxShadow: hover ? "inset 0 0 0 1px rgba(255,255,255,.5), 0 6px 16px rgba(0,0,0,.18)" : "inset 0 0 0 1px rgba(255,255,255,.45), 0 4px 12px rgba(0,0,0,.12)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 10,
          zIndex: 1,
          transition: "box-shadow 160ms ease, transform 160ms ease, background 160ms ease",
          transform: hover ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 18, letterSpacing: 0.2, textShadow: "0 2px 10px rgba(0,0,0,.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
          <div style={{ color: "rgba(255,255,255,.95)", fontSize: 13, marginTop: 2, textShadow: "0 2px 8px rgba(0,0,0,.35)" }}>{projects} {projects === 1 ? "project" : "projects"}</div>
        </div>
        <img src="/pencil.png" alt="" aria-hidden style={{ width: 18, height: 18, opacity: 0.95, filter: "drop-shadow(0 1px 4px rgba(0,0,0,.3))" }} />
      </div>
    </div>
  );
}

function IconBtn({ title, onClick, icon, active }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      aria-label={title}
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onFocus={() => setHov(true)}
      onBlur={() => setHov(false)}
      style={{
        width: 36,
        height: 36,
        borderRadius: 12,
        border: hov ? "1px solid rgba(255,255,255,.35)" : "1px solid rgba(255,255,255,.22)",
        background: hov ? "rgba(0,0,0,.14)" : "rgba(0,0,0,.10)",
        backdropFilter: "blur(4px)",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        outline: "none",
        filter: active ? "drop-shadow(0 2px 8px rgba(234,67,53,0.45))" : "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
        transition: "background 140ms, border 140ms, transform 140ms",
        transform: hov ? "translateY(-1px)" : "none",
      }}
      aria-pressed={!!active}
    >
      <img src={icon} alt="" aria-hidden style={{ width: 18, height: 18 }} />
    </button>
  );
}

function RecentCard({ id, title, text, onRemove }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current || !btnRef.current) return;
      if (menuRef.current.contains(e.target) || btnRef.current.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: 150,
        borderRadius: 16,
        background: "#fff",
        border: "1px solid #eee",
        boxShadow: hover ? "0 12px 28px rgba(0,0,0,0.16)" : "0 8px 24px rgba(0,0,0,0.10)",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 160ms, transform 160ms",
        transform: hover ? "translateY(-2px)" : "none",
      }}
    >
      <img src="/recentlyviewed.svg" alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <button
        ref={btnRef}
        aria-label={`More options for ${title}`}
        style={{
          position: "absolute",
          right: 10,
          top: 10,
          width: 28,
          height: 28,
          borderRadius: 8,
          border: "1px solid #eee",
          display: "grid",
          placeItems: "center",
          background: "#fff",
          cursor: "pointer",
          outline: "none",
          zIndex: 2,
          opacity: hover ? 1 : 0.9,
        }}
        onClick={() => setOpen((v) => !v)}
        onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(66,133,244,.35)")}
        onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>
      {open && (
        <div
          ref={menuRef}
          role="menu"
          style={{
            position: "absolute",
            right: 10,
            top: 44,
            background: "#fff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 8px 24px rgba(0,0,0,.08)",
            borderRadius: 10,
            padding: 6,
            zIndex: 3,
            minWidth: 140,
          }}
        >
          <button
            role="menuitem"
            onClick={() => {
              onRemove(id);
              setOpen(false);
            }}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "8px 10px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              borderRadius: 8,
              fontSize: 14,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.28)", display: "grid", placeItems: "center", zIndex: 50, backdropFilter: "blur(2px)" }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, 96vw)",
          maxWidth: "96vw",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 20,
          border: "1px solid #eef2f7",
          boxShadow: "0 24px 72px rgba(0,0,0,0.22)",
          padding: 22,
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CreateEditDialog({ mode, draftName, setDraftName, draftHue, setDraftHue, hueOptions, onCancel, onSave }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onSave();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, onSave]);

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>{mode === "create" ? "Create folder" : "Edit folder"}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>title</div>
      <input
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
        placeholder="name your folder"
        autoFocus
        style={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          fontSize: 14,
          outline: "none",
          transition: "box-shadow 120ms, border 120ms",
          boxShadow: "0 0 0 0 rgba(66,133,244,0)",
        }}
        onFocus={(e) => (e.target.style.boxShadow = "0 0 0 4px rgba(66,133,244,0.20)")}
        onBlur={(e) => (e.target.style.boxShadow = "0 0 0 0 rgba(66,133,244,0)")}
      />
      <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", margin: "16px 0 8px" }}>Choose a color</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {hueOptions.map((o) => (
          <button
            key={o.label}
            onClick={() => setDraftHue(o.deg)}
            aria-label={o.label}
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              border: draftHue === o.deg ? "3px solid #111" : "2px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              transition: "transform 120ms",
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(66,133,244,.35)")}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <img src="/fullfolder.svg" alt="" aria-hidden="true" style={{ width: 34, height: 34, filter: `hue-rotate(${o.deg}deg) saturate(1.1)` }} />
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 20 }}>
        <button
          onClick={onCancel}
          style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 600, outline: "none" }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(66,133,244,.35)")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          discard
        </button>
        <button
          onClick={onSave}
          style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#3b82f6", color: "#fff", fontWeight: 800, cursor: "pointer", outline: "none" }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(66,133,244,.35)")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          save
        </button>
      </div>
    </div>
  );
}
