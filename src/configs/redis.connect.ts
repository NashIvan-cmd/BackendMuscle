import { createClient } from 'redis';
import redis from "redis";
import * as dotenv from "dotenv";

dotenv.config();

// const redisClient = redis.createClient({
//     url: `redis://${process.env.REDIS_PASSWORD || 'localhost'}@redis:6379`
// }) option 1

// option 2

export const redisClient = redis.createClient({
    socket: {
        host: 'redis',
        port:  6379,
        
    },
    username: 'default',
    password: process.env.REDIS_PASSWORD
});

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.log(`Redis error: ${err}`));

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("🚀 Redis client ready to use")
    } catch (error) {
        console.error('Failed to connect Redis:', error);
    }
}