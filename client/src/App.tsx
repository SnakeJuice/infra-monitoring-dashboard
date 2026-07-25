import { useEffect, useState } from 'react';

interface Telemetry {
  timestamp: string;
  cpuLoad: number;
  memUsedGB: string;
  memTotalGB: string;
}

export default function App() {
  const [data, setData] = useState<Telemetry | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      setData(payload);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Monitoreo de Infraestructura</h1>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${connected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
          {connected ? '● En Vivo' : '○ Desconectado'}
        </span>
      </header>

      {data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 p-6 rounded-xl">
            <h2 className="text-slate-400 text-sm mb-1">Carga de CPU</h2>
            <p className="text-4xl font-bold text-indigo-400">{data.cpuLoad}%</p>
          </div>

          <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 p-6 rounded-xl">
            <h2 className="text-slate-400 text-sm mb-1">Uso de Memoria RAM</h2>
            <p className="text-4xl font-bold text-cyan-400">
              {data.memUsedGB} GB <span className="text-lg text-slate-500">/ {data.memTotalGB} GB</span>
            </p>
          </div>
        </div>
      ) : (
        <p className="text-slate-400">Esperando primer paquete de datos...</p>
      )}
    </div>
  );
}