import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import scanRoutes from "./routes/scanRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use("/api/scan", scanRoutes);

io.on("connection", (socket) => {
    console.log("Client connected");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});