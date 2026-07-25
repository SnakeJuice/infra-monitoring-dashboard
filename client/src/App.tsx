import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Cpu, HardDrive, Box, Activity, Server } from 'lucide-react';

interface ContainerData {
  id: string;
  name: string;
  image: string;
  state: string;
  cpuPercent: number;
  memUsageMB: string;
}

interface Telemetry {
  timestamp: string;
  cpuLoad: number;
  memUsedGB: number;
  memTotalGB: number;
  memPercent: number;
  containers: ContainerData[];
}

export default function App() {
  const [history, setHistory] = useState<Telemetry[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (event) => {
      const payload: Telemetry = JSON.parse(event.data);
      setHistory((prev) => {
        // Conservamos los últimos 20 puntos para la gráfica
        const updated = [...prev, payload];
        return updated.slice(-20);
      });
    };

    return () => ws.close();
  }, []);

  const current = history[history.length - 1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Server className="w-8 h-8 text-indigo-400" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">System Telemetry Dashboard</h1>
              <p className="text-slate-400 text-sm">Monitoreo de recursos e infraestructura en tiempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full w-fit">
            <span className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
              {connected ? 'WebSocket En Vivo' : 'Desconectado'}
            </span>
          </div>
        </header>

        {/* Tarjetas y Gráficos Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gráfico CPU */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h2 className="font-semibold text-slate-200">Uso de CPU</h2>
              </div>
              <span className="text-3xl font-bold text-indigo-400">
                {current ? `${current.cpuLoad}%` : '--'}
              </span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="cpuLoad" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#cpuGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico Memoria RAM */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-cyan-400" />
                <h2 className="font-semibold text-slate-200">Memoria RAM</h2>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-cyan-400">
                  {current ? `${current.memPercent}%` : '--'}
                </span>
                <p className="text-xs text-slate-400">
                  {current ? `${current.memUsedGB} GB / ${current.memTotalGB} GB` : ''}
                </p>
              </div>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="memPercent" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#ramGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Sección de Contenedores Docker */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-emerald-400" />
              <h2 className="font-semibold text-slate-200">Contenedores Docker Activos</h2>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              {current?.containers ? `${current.containers.length} Contenedores` : '0 Contenedores'}
            </span>
          </div>

          {current?.containers && current.containers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Nombre</th>
                    <th className="py-3 px-4">Imagen</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">CPU %</th>
                    <th className="py-3 px-4">RAM MB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                  {current.containers.map((container) => (
                    <tr key={container.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono text-xs text-indigo-400">{container.id}</td>
                      <td className="py-3 px-4 font-medium text-slate-100">{container.name}</td>
                      <td className="py-3 px-4 text-xs text-slate-400 font-mono">{container.image}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${container.state === 'running' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'}`}>
                          {container.state}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{container.cpuPercent}%</td>
                      <td className="py-3 px-4 font-mono">{container.memUsageMB} MB</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
              <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No se detectaron contenedores Docker en ejecución en la máquina host.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}