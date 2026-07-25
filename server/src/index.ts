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

      const telemetryData = {
        timestamp: new Date().toISOString(),
        cpuLoad: Math.round(currentLoad.currentLoad),
        memUsedGB: (mem.active / 1024 / 1024 / 1024).toFixed(2),
        memTotalGB: (mem.total / 1024 / 1024 / 1024).toFixed(2),
      };

      ws.send(JSON.stringify(telemetryData));
    } catch (err) {
      console.error('Error al recolectar métricas:', err);
    }
  }, 2000);

  ws.onclose = () => {
    console.log('❌ Cliente desconectado');
    clearInterval(interval);
  };
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});