const socket = io();
const name = prompt("Please Enter your name : ");
const messagesDiv = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const users = document.querySelector("#users");
const onlineUsers = document.querySelector("#onlineUsers");

function handleCommand(command) {
	switch (command) {
		case "help":
			return `
          <p>/help : shows this message</p>
          <p>/random : Gives a random number between 1 and 100</p>
          <p>/clear : Clears the chat window</p>
          `;
		case "random":
			const randomNum = Math.floor(Math.random() * 100);
			return `
          <p>Your Random number is : ${randomNum}</p>
          `;
		case "clear":
			messagesDiv.innerHTML = "<div></div>";
			return;
		default:
			break;
	}
}

socket.emit("new-user-joined", name);

messageForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const message = messageInput.value.trim();
	if (message) {
		if (message[0][0] === "/") {
			const messageElement = document.createElement("p");
			messageElement.classList.add("chat");
			const command = message.replace("/", "");
			messageElement.innerHTML = handleCommand(command);
			command === "clear" ? null : messagesDiv.appendChild(messageElement);
			messageInput.value = "";
		} else {
			socket.emit("message", message);
			messageInput.value = "";
		}
		messagesDiv.scrollTop = messagesDiv.scrollHeight;
	}
});

socket.on("message", (message) => {
	const messageElement = document.createElement("p");
	messageElement.classList.add("chat");
	messageElement.textContent = message;
	messagesDiv.appendChild(messageElement);
});

socket.on("new-user-joined", ({ name, totalUsers }) => {
	users.textContent = name;
	onlineUsers.innerHTML = `Users : ${totalUsers}`;
});
