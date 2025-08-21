import * as dotenv from "dotenv";
import { connectDB } from "./configs/mongoose.config.ts";
import { connectRedis } from "./configs/redis.connect.ts";
import createApp from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Creates one instance of server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    await connectRedis();
    
    // Create app instance
    const app = createApp();
    
    console.log("Port Number", PORT);
    // PID -> Processing ID
    // 0.0.0.0 Makes it listen to all the ports 
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server PID ${process.pid} listening on port ${PORT}`);
    });
    
  } catch (error) {
    console.error(`❌ Failed to start server on port ${PORT}:`, error);
    process.exit(1);
  }
};

startServer();

/*
    Will make one container per server (look at docker-compose.yml)
    Starts one express server in dev or prod

    Strong isolation → each container has its own filesystem, memory, PID space.
    Easier scaling → can add/remove containers via Docker Swarm / Kubernetes.
    Industry standard → matches how microservices are deployed in production.
    Resiliency → if one crashes, Docker restarts it without killing others.

    Best out of 3 and is used for production
*/