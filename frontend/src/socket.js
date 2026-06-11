import { io } from "socket.io-client";

const socket = io("https://auditing-monkey.onrender.com/");

export default socket;