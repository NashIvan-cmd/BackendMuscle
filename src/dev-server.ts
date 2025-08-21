import { spawn } from "child_process";
import * as dotenv from "dotenv";

dotenv.config();

const basePort = 3001;
const numServers = 3;
const servers = [];

console.log("🚀 Starting 3 development server...");

// Start multiple server processes
for (let i = 0; i < numServers; i++) {
  const port = basePort + i;
  
  // Spawn a new Node.js process for each server
  const serverProcess = spawn('node', ['server-instance.js'], {
    env: { 
      ...process.env, 
      PORT: port.toString()
    },
    stdio: 'inherit' // This allows you to see console logs from each process
  });
  
  servers.push({ process: serverProcess, port });
  console.log(`👷 Server ${i + 1} started on port ${port} with PID ${serverProcess.pid}`);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down all servers...');
  servers.forEach(({ process: serverProcess, port }) => {
    console.log(`💀 Killing server on port ${port}`);
    serverProcess.kill('SIGTERM');
  });
  process.exit(0);
});

// Handle server crashes and restart them
servers.forEach(({ process: serverProcess, port }, index) => {
  serverProcess.on('exit', (code, signal) => {
    if (code !== 0) {
      console.log(`💀 Server on port ${port} crashed. Restarting...`);
      
      // Restart the crashed server
      const newProcess = spawn('node', ['server-instance.js'], {
        env: { 
          ...process.env, 
          PORT: port.toString()
        },
        stdio: 'inherit'
      });
      
      servers[index].process = newProcess;
      console.log(`🔄 Server restarted on port ${port} with PID ${newProcess.pid}`);
    }
  });
});

/* 
  The node:child_process module provides the ability to spawn 
  subprocesses in a manner that is similar, 
  but not identical

  Pros
  Good for local dev to simulate multiple backends.
  Easy to test load-balancing (nginx routing 3001, 3002, 3003).
  Handles auto-restarts of crashed processes.

  Cons
  Not a production pattern → no isolation, no orchestration.
  Hard to manage at scale (monitoring, restarts, networking).
  Reinventing what Docker/Kubernetes already solves.
*/