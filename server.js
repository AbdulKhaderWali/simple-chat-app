// Import required modules
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

// Create an Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the 'public' directory
app.use(express.static(__dirname + "/public"));

// Handle socket connections
io.on("connection", (socket) => {
	console.log("A user connected");

	// Handle message event
	socket.on("message", (message) => {
		console.log("Message:", message);
		// Broadcast the message to all connected clients
		io.emit("message", message);
	});

	// Handle disconnection
	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
