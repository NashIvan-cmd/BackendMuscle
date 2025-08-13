import { createClient } from 'redis';

export const buildRedisConnection = async () => {
    const client = createClient();

    client.on('error', err => console.log('Redis client error', err));

    await client.connect();
    return client;
}