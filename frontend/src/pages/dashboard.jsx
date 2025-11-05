import { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    api.get("/dashboard/summary").then(res => setSummary(res.data));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total de pacientes: {summary.total_patients}</p>
      <p>Total de triagens: {summary.total_triage_entries}</p>
      <p>Total na fila: {summary.total_queue_entries}</p>
    </div>
  );
}
