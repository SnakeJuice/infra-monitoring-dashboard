import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import si from 'systeminformation';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 4000;

// Ruta de estado/healthcheck
app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    service: 'Telemetry WebSocket Server',
    timestamp: new Date().toISOString(),
  });
});

// Estructura tipada para la telemetría de contenedores
interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  state: string;
  cpuPercent: number;
  memUsageMB: string;
}

wss.on('connection', (ws) => {
  console.log('⚡ Cliente conectado al WebSocket');

  const interval = setInterval(async () => {
    try {
      const mem = await si.mem();
      const currentLoad = await si.currentLoad();
      
      // Tipamos explícitamente el arreglo
      let dockerContainers: ContainerInfo[] = [];

      try {
        const containers = await si.dockerContainers();
        // Le añadimos (c: any) para que TypeScript reconozca las propiedades dinámicas de Docker
        dockerContainers = containers.map((c: any) => ({
          id: c.id ? c.id.substring(0, 12) : '',
          name: c.name || 'Desconocido',
          image: c.image || 'Desconocido',
          state: c.state || 'unknown',
          cpuPercent: c.cpuPercent ? Math.round(c.cpuPercent * 10) / 10 : 0,
          memUsageMB: c.memUsage ? (c.memUsage / 1024 / 1024).toFixed(1) : '0',
        }));
      } catch (e) {
        dockerContainers = [];
      }

      const telemetryData = {
        timestamp: new Date().toLocaleTimeString(),
        cpuLoad: Math.round(currentLoad.currentLoad),
        memUsedGB: parseFloat((mem.active / 1024 / 1024 / 1024).toFixed(2)),
        memTotalGB: parseFloat((mem.total / 1024 / 1024 / 1024).toFixed(2)),
        memPercent: Math.round((mem.active / mem.total) * 100),
        containers: dockerContainers,
      };

      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(telemetryData));
      }
    } catch (err) {
      console.error('Error al recolectar métricas:', err);
    }
  }, 2000);

  ws.on('close', () => {
    console.log('❌ Cliente desconectado');
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});