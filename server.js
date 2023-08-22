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

const user = {};
const Replacement = {
	react: "⚛️",
	woah: "😲",
	hey: "👋",
	lol: "😂",
	like: "🤍",
	congratulations: "🎉",
};

// Handle socket connections
io.on("connection", (socket) => {
	console.log("A user connected");
	socket.on("new-user-joined", (name) => {
		console.log("New User", name);
		user[socket.id] = name;
		socket.emit("new-user-joined", name);
	});

	// Handle message event
	socket.on("message", (message) => {
		console.log("Message:", message);
		// Broadcast the message to all connected clients
		const messageArray = message.split(" ");
		const newString = messageArray.map((word) => {
			const lowerCase = word.toLowerCase();
			return Replacement[lowerCase] || word;
		});
		io.emit("message", newString.join(" "));
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
