import redis from 'redis';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient({ 
    host: REDIS_HOST, port: REDIS_PORT 
});

client.on('error', (err) => {
    throw new Error (`Error connecting to Redis: ${err}`);
});

export default client;