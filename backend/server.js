import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import scanRoutes from "./routes/scanRoutes.js";

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: false
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("AutoQA Backend Running");
});

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*",
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