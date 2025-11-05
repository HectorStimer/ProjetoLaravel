import React, { useEffect } from "react";

export default function Toast({ message, onClose, type = "info" }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose && onClose(), 3500);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;

  const bg = type === "error" ? "#fee2e2" : "#ecfdf5";
  const color = type === "error" ? "#991b1b" : "#065f46";
  const border = type === "error" ? "#fecaca" : "#bbf7d0";

  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        top: 20,
        background: bg,
        color,
        border: `1px solid ${border}`,
        padding: "10px 14px",
        borderRadius: 8,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        zIndex: 9999,
        minWidth: 200,
      }}
    >
      <div style={{ fontSize: 14 }}>{message}</div>
      <div style={{ marginTop: 6, textAlign: "right" }}>
        <button
          onClick={() => onClose && onClose()}
          style={{
            background: "transparent",
            color,
            border: 0,
            cursor: "pointer",
            fontSize: 12,
            padding: "4px 6px",
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}