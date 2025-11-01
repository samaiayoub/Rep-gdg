import React, { useEffect, useMemo, useRef, useState } from "react";

export default function MainHub() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const SIDEBAR_WIDTH = 280;
  const SIDEBAR_PEEK = 16;

  const CONFIG = useMemo(
    () => ({
      count: 12,
      strokeWidth: 8,
      borderWidth: 3,
      speed: 0.18,
      wiggle: 8,
      rightBandTop: 45,
      rightBandBottom: 95,
      bottomBandLeft: 5,
      bottomBandRight: 50,
      overshoot: 0.8,
      colors: ["#22c55e", "#ef4444", "#eab308", "#3b82f6"],
      coreOpacity: 0.65,
      background: "#ffffff",
      mask: { cx: 50, cy: 50, w: 42, h: 18, r: 6 }
    }),
    []
  );

  const [tick, setTick] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const loop = () => {
      setTick((t) => t + 1);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, []);

  const n2 = (t, seed) =>
    Math.sin(t * 0.006 + seed * 1.3) * 0.6 +
    Math.sin(t * 0.004 + seed * 2.1) * 0.3 +
    Math.sin(t * 0.003 + seed * 3.7) * 0.1;

  const strands = useMemo(() => {
    return Array.from({ length: CONFIG.count }, (_, i) => {
      const seed = (i + 1) * 19.17;
      const t = i / Math.max(1, CONFIG.count - 1);
      const yRightBase =
        CONFIG.rightBandTop + t * (CONFIG.rightBandBottom - CONFIG.rightBandTop);
      const xBottomBase =
        CONFIG.bottomBandRight - t * (CONFIG.bottomBandRight - CONFIG.bottomBandLeft);
      const color = CONFIG.colors[i % CONFIG.colors.length];
      return { i, seed, yRightBase, xBottomBase, color };
    });
  }, [
    CONFIG.count,
    CONFIG.rightBandTop,
    CONFIG.rightBandBottom,
    CONFIG.bottomBandLeft,
    CONFIG.bottomBandRight,
    CONFIG.colors
  ]);

  const pathFor = (s) => {
    const t = tick * CONFIG.speed;
    const bottomY = 100 + CONFIG.overshoot;
    const yA = clamp(
      s.yRightBase + n2(t, s.seed) * CONFIG.wiggle,
      CONFIG.rightBandTop,
      CONFIG.rightBandBottom
    );
    const xTarget = 0 + CONFIG.overshoot;
    const c1x = 80 + n2(t, s.seed + 21) * 10;
    const c2x = xTarget + n2(t, s.seed + 7) * 12;
    const down = Math.abs(n2(t, s.seed));
    let c1y = yA + 8 + down * 18;
    let c2y = bottomY - (10 + down * 16);
    if (c2y <= c1y + 4) c2y = c1y + 4;
    return `M ${100 + CONFIG.overshoot} ${yA} C ${c1x} ${c1y} ${c2x} ${c2y} ${xTarget} ${bottomY}`;
  };

  const holePath = useMemo(() => {
    const { cx, cy, w, h, r: rRaw } = CONFIG.mask;
    const r = Math.min(rRaw, w / 2, h / 2);
    const x = cx - w / 2;
    const y = cy - h / 2;
    const outer = `M0 0 H100 V100 H0 Z`;
    const inner = [
      `M ${x + r} ${y}`,
      `H ${x + w - r}`,
      `A ${r} ${r} 0 0 1 ${x + w} ${y + r}`,
      `V ${y + h - r}`,
      `A ${r} ${r} 0 0 1 ${x + w - r} ${y + h}`,
      `H ${x + r}`,
      `A ${r} ${r} 0 0 1 ${x} ${y + h - r}`,
      `V ${y + r}`,
      `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
      `Z`
    ].join(" ");
    return `${outer} ${inner}`;
  }, [CONFIG.mask]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: CONFIG.background
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <defs>
          <mask id="hole" maskUnits="userSpaceOnUse">
            <path d={holePath} fill="#fff" fillRule="evenodd" />
          </mask>
          <clipPath id="frame">
            <rect x="0" y="0" width="100" height="100" />
          </clipPath>
        </defs>
        <g mask="url(#hole)" clipPath="url(#frame)">
          {strands
            .filter((s) => s.i >= 3)
            .map((s) => (
              <g key={s.i}>
                <path
                  d={pathFor(s)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={CONFIG.strokeWidth + CONFIG.borderWidth}
                  strokeLinecap="butt"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={pathFor(s)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={CONFIG.strokeWidth}
                  strokeLinecap="butt"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  opacity={CONFIG.coreOpacity}
                />
              </g>
            ))}
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1
        }}
      >
        <img src="/gdglogo.svg" alt="GDG Logo" style={{ height: 200, width: "auto" }} />
      </div>

      <aside
        aria-label="Sidebar"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: SIDEBAR_WIDTH,
          transform: `translateX(${sidebarOpen ? 0 : -(SIDEBAR_WIDTH - SIDEBAR_PEEK)}px)`,
          transition: "transform 260ms ease",
          background: "#fff",
          boxShadow: sidebarOpen
            ? "0 8px 30px rgba(0,0,0,0.15)"
            : "0 4px 16px rgba(0,0,0,0.12)",
          borderRight: "1px solid #eee",
          zIndex: 3,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          aria-expanded={sidebarOpen}
          aria-controls="gdg-sidebar"
          title={sidebarOpen ? "Close" : "Open"}
          style={{
            position: "absolute",
            right: -16,
            top: 72,
            width: 32,
            height: 48,
            borderRadius: "0 8px 8px 0",
            border: "1px solid #eee",
            background: "#ffffff",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d={sidebarOpen ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div style={{ padding: "20px 16px 8px 16px" }}>
          <img src="/GDG Algiers Logo.svg" alt="GDG Algiers" style={{ width: 160, height: "auto" }} />
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: "#e11d48", marginLeft: 16 }}>
          Departments
        </div>

        <nav
          id="gdg-sidebar"
          aria-label="Departments"
          style={{ marginTop: 8, padding: "0 12px", overflowY: "auto", flex: 1 }}
        >
          {[
            { label: "Design", active: true },
            { label: "Developpent" },
            { label: "Communication" },
            { label: "Human Ressources" },
            { label: "Logistics" },
            { label: "Multimedia" },
            { label: "External Relations" }
          ].map((it, idx) => (
            <button
              key={idx}
              style={{
                width: "100%",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 10px",
                marginBottom: 6,
                borderRadius: 8,
                border: "1px solid " + (it.active ? "#f3d9b1" : "#eee"),
                background: it.active ? "#faebd7" : "#fff",
                fontWeight: it.active ? 600 : 500,
                color: "#111",
                cursor: "pointer"
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  border: "2px solid #111",
                  display: "inline-block"
                }}
              />
              <span>{it.label}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                style={{ marginLeft: "auto", opacity: 0.7 }}
              >
                <path
                  d="M6 9l6 6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </nav>

        <div
          style={{
            borderTop: "1px solid #eee",
            padding: 12,
            display: "grid",
            gap: 10
          }}
        >
          <button
            style={{
              textAlign: "left",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #eee",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 500
            }}
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
              fontWeight: 600
            }}
          >
            ⎋ Log out
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#e5e7eb"
              }}
            />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontWeight: 600 }}>naima</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                Google • cheraitianaima1@gmail.com
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
