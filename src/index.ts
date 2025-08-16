import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import auth from "./routes/auth.routes"
import egg from "./routes/egg.routes"
import * as dotenv from "dotenv";
import { connectDB } from "./configs/mongoose.config";
import { errorHandler } from "./middleware/error.middleware";
import os from "os"
import { connectRedis } from "./configs/redis.connect";

dotenv.config();
// Recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let port = 3000;

// Connect to database ONCE before creating servers
const startServers = async () => {
  try {
    // Single database connection for all servers
    await connectDB();
    // Single redis connection for all servers
    await connectRedis();
    console.log('✅ Database connected - ready to start servers');

    let port = 3000;

    // Creating 3 node servers for load balancing
    for (let i = 0; i < 3; i++) {
      const app = express();
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      
      const currentPort = port;
      
      app.get('/', (req, res) => {    
        res.send(`Hello from server on port ${currentPort}!`);
      });

      // Set the views directory
      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'ejs');
      app.use(express.static(path.join(__dirname, 'public')));

      app.get('/index', (req, res) => {
        res.render('index');
      });

      app.use('/api', (req, res, next) => { 
        res.locals.portNumber = port // Let the portNumber variable to live until the last response
        next(); // Calls the next middleware
      })
      
      app.use('/api', auth);
      app.use('/api', egg);
      app.use(errorHandler);

      // 0.0.0.0 Makes it listen to all ports not just localhost
      app.listen(currentPort, '0.0.0.0', () => {
        console.log(`🚀 Server ${i + 1} listening on port ${currentPort}`);
      });
      
      port++;
    }
  } catch (error) {
    console.error('❌ Failed to start servers:', error);
    process.exit(1);
  }
};

startServers();

// app.listen(port, () => {
//     console.log(`App listening on port ${port}`);
// })