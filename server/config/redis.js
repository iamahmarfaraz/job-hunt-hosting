import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();
const redisClient = new Redis(process.env.REDIS_URL); // Connects to Redis instance
export default redisClient;
