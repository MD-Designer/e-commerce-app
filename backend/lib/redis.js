import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL);

// await redis.set('foo','bar');
// client.on("error", function(err) {
//   throw err;
// });
// await client.connect()

// // Disconnect after usage
// await client.disconnect();
