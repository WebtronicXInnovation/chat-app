const socket = io();
let replyTo = null;
let username = null;

function addMessage(username, message, replyToMessage, isCurrentUser) {
  const container = document.createElement("div");
  container.classList.add("message-container");

  const item = document.createElement("div");
  item.classList.add("message");
  item.classList.add(isCurrentUser ? "right" : "left");

  if (!isCurrentUser) {
    item.textContent = `${username}: ${message}`;
  } else {
    item.textContent = message;
  }

  if (replyToMessage) {
    const reply = document.createElement("div");
    reply.textContent = "Replying to: " + replyToMessage;
    reply.classList.add("reply-to");
    item.prepend(reply);
  }

  const replyButton = document.createElement("button");
  // replyButton.textContent = "Reply";
  replyButton.classList.add("btn", "btn-link", "p-0", "ml-2"); // Add Bootstrap classes for better styling
  replyButton.innerHTML = '<i class="fas fa-reply"></i>'; // Font Awesome reply icon

  replyButton.onclick = () => {
    replyTo = message;
    document.getElementById(
      "message-input"
    ).placeholder = `Replying to: ${message}`;
    document.getElementById("message-input").focus();
  };
  item.appendChild(replyButton);

  container.appendChild(item);
  document.getElementById("messages").appendChild(container);
  window.scrollTo(0, document.body.scrollHeight);
}

document.getElementById("join-button").onclick = function () {
  username = document.getElementById("username-input").value;
  if (username) {
    document.getElementById("user-container").style.display = "none";
    document.getElementById("message-input").disabled = false;
    document.getElementById("send-button").disabled = false;
    socket.emit("user joined", username);
    document.getElementById("message-input").focus(); // Focus on message input after joining
  } else {
    alert("Please enter a username.");
  }
};

document.getElementById("send-button").onclick = function () {
  const message = document.getElementById("message-input").value;
  if (message) {
    socket.emit("chat message", { username, message, replyTo });
    document.getElementById("message-input").value = "";
    document.getElementById("message-input").placeholder =
      "Type your message here...";
    replyTo = null;
    document.getElementById("message-input").focus(); // Refocus on message input after sending
  } else {
    alert("Please enter a message.");
  }
};

// enter function
document
  .getElementById("username-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      document.getElementById("join-button").click();
    }
  });

document
  .getElementById("message-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      document.getElementById("send-button").click();
    }
  });
//end

// Automatically focus on the username input field when the page loads
document.getElementById("username-input").focus();
// end

socket.on("chat message", function (data) {
  const isCurrentUser = data.username === username;
  addMessage(data.username, data.message, data.replyTo, isCurrentUser);
});

socket.on("user joined", function (username) {
  const item = document.createElement("div");
  item.classList.add("message");
  item.textContent = `${username} joined the chat`;
  item.style.fontStyle = "italic";
  document.getElementById("messages").appendChild(item);
});
