import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import si from 'systeminformation';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 4000;

wss.on('connection', (ws) => {
  console.log('⚡ Cliente conectado al WebSocket');

  const interval = setInterval(async () => {
    try {
      const mem = await si.mem();
      const currentLoad = await si.currentLoad();
      
      // Obtener información de contenedores Docker (si Docker está ejecutándose)
      let dockerContainers = [];
      try {
        const containers = await si.dockerContainers();
        dockerContainers = containers.map((c) => ({
          id: c.id.substring(0, 12),
          name: c.name,
          image: c.image,
          state: c.state,
          cpuPercent: c.cpuPercent ? Math.round(c.cpuPercent * 10) / 10 : 0,
          memUsageMB: c.memUsage ? (c.memUsage / 1024 / 1024).toFixed(1) : '0',
        }));
      } catch (e) {
        // Si Docker no está corriendo localmente, devolverá array vacío
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