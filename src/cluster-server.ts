import cluster from 'cluster';
import * as dotenv from "dotenv";
import { connectDB } from "./configs/mongoose.config";
import { connectRedis } from "./configs/redis.connect";
import createApp from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const NUM_WORKERS = 3;

if (cluster.isPrimary) {
  console.log(`🚀 Master process ${process.pid} is running`);
  
  for (let i = 0; i < NUM_WORKERS; i++) {
    const worker = cluster.fork();
    console.log(`👷 Worker ${i + 1} spawned with PID ${worker.process.pid}`);
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`💀 Worker ${worker.process.pid} died. Spawning a new one...`);
    cluster.fork();
  });
  
} else {
  const startWorker = async () => {
    try {
      await connectDB();
      await connectRedis();
      
      const app = createApp();
      
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🔥 Worker ${process.pid} listening on port ${PORT}`);
      });
      
    } catch (error) {
      console.error(`❌ Worker ${process.pid} failed to start:`, error);
      process.exit(1);
    }
  };
  
  startWorker();
}

/*
    Run Multiple server workers inside one container

    If the container itself dies → all workers die.
    Scaling horizontally (across machines) still requires Docker orchestration.
    Workers share memory (no true isolation).

*/