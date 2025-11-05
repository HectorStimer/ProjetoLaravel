import React, { useEffect, useState } from "react";
import api from "./api/api";
import Toast from "./components/Toast";

export default function App() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  async function fetchQueue() {
    setLoading(true);
    try {
      const res = await api.get("/queue");
      setQueue(res.data || []);
    } catch (err) {
      setToast({ text: "Erro ao carregar fila", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function takeTicket() {
    setToast(null);
    try {
      const res = await api.post("/queue/enqueue");
      if (res.status === 201 || res.status === 200) {
        setToast({ text: "Senha retirada com sucesso" });
        await fetchQueue();
      } else {
        setToast({ text: "Falha ao retirar senha", type: "error" });
      }
    } catch (err) {
      setToast({ text: "Erro ao retirar senha", type: "error" });
    }
  }

  async function callNext() {
    setToast(null);
    try {
      const res = await api.get("/queue/next");
      if (res.status === 200) {
        setToast({ text: `Chamando #${res.data.number}` });
        await fetchQueue();
      } else {
        const message = res.data?.message || "Nenhuma senha na fila";
        setToast({ text: message, type: "info" });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Nenhuma senha na fila";
      setToast({ text: msg, type: "info" });
    }
  }

  async function finishServing(id) {
    setToast(null);
    try {
      await api.post(`/queue/${id}/finish`);
      setToast({ text: "Atendimento finalizado" });
      await fetchQueue();
    } catch {
      setToast({ text: "Erro ao finalizar atendimento", type: "error" });
    }
  }

  useEffect(() => {
    fetchQueue();
    const iv = setInterval(fetchQueue, 3000);
    return () => clearInterval(iv);
  }, []);

  const serving = queue.find((q) => q.status === "serving" || q.status === "called");
  const waiting = queue.filter((q) => q.status === "waiting");

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      {toast && (
        <Toast
          message={toast.text}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1>Fila — MVP</h1>

      <div style={{ marginBottom: 16 }}>
        <button onClick={takeTicket} style={{ marginRight: 8 }}>
          Retirar senha
        </button>
        <button className="secondary" onClick={callNext}>
          Chamar próxima
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 8 }}>Atendendo agora</h2>
        {loading && !serving ? (
          <div className="spinner" />
        ) : serving ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div>
              <strong style={{ fontSize: 20 }}>#{serving.number}</strong>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{serving.status}</div>
            </div>
            <div>
              <button onClick={() => finishServing(serving.id)}>Concluir</button>
            </div>
          </div>
        ) : (
          <div>Nenhum atendimento em andamento</div>
        )}
      </div>

      <div>
        <h2>Fila de espera ({waiting.length})</h2>
        {loading ? (
          <div className="spinner" />
        ) : waiting.length === 0 ? (
          <div>Nenhuma senha aguardando</div>
        ) : (
          <ul>
            {waiting.map((w) => (
              <li key={w.id}>#{w.number}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}