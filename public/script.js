const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);

  div.innerHTML = `<strong>${sender}:</strong> ${text}`;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = input.value;

  if (!message) return;

  addMessage(message, "user");

  input.value = "";

  const response = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message
    })
  });

  const data = await response.json();

  addMessage(data.reply, "bot");
}

sendBtn.addEventListener("click", sendMessage);