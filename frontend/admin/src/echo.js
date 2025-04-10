import Echo from "laravel-echo";
import { io } from "socket.io-client";

// Make sure `io` is available globally
window.io = io;

const echo = new Echo({
  broadcaster: "socket.io", // Ensure broadcaster is socket.io
  client: io, // Pass socket.io client directly
  host: "http://127.0.0.1:6001", // WebSocket server URL
  transports: ["websocket"], // Use WebSocket transport
});

export default echo;
