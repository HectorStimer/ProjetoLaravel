import { useState, useEffect } from "react";
import api from "../api/api";

export default function QueueScreen() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const fetchQueue = async () => {
      const res = await api.get("/queue/screening");
      setQueue(res.data);
    };
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // Atualiza a cada 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Fila de Triagem</h1>
      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Serviço</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {queue.map((q) => (
            <tr key={q.id}>
              <td>{q.patient.name}</td>
              <td>{q.service.name}</td>
              <td>{q.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
