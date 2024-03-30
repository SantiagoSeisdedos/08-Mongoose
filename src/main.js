import { connectMongoDB } from "../db/execution.config.js";
import { ServerAPI } from "./app/app.js";
import { PORT } from "./config/config.js";

await connectMongoDB();

export const serverAPI = new ServerAPI();
await serverAPI.startServer(PORT);