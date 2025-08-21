import { createClient } from 'redis';
import redis from "redis";
import * as dotenv from "dotenv";

dotenv.config();

// Only create client if not in test environment
let redisClient: any = null;

if (process.env.NODE_ENV !== 'test') {
    redisClient = redis.createClient({
        socket: {
            host: 'redis',
            port: 6379,
        },
        username: 'default',
        password: process.env.REDIS_PASSWORD
    });

    redisClient.on('connect', () => console.log('Connected to Redis'));
    redisClient.on('error', (err: any) => console.log(`Redis error: ${err}`));
}

export { redisClient };

export const connectRedis = async () => {
    if (!redisClient) {
        console.log("Redis client not initialized (test environment)");
        return;
    }
    
    try {
        await redisClient.connect();
        console.log("🚀 Redis client ready to use")
    } catch (error) {
        console.error('Failed to connect Redis:', error);
    }
}