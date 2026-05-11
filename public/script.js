const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("deliver-btn");
const clearBtn = document.getElementById("clear-btn");

function toLatex(text) {
  return text
    .replace(/(\w+)\/(\w+)/g, "$$\\frac{$1}{$2}$$")
    .replace(/(\w)\^(\w+)/g, "$1^{$2}")
    .replace(/sqrt\((.*?)\)/g, "$$\\sqrt{$1}$$");
}

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);

  const safeText =
    typeof text === "string"
      ? text
      : JSON.stringify(text);

  div.innerHTML = `
    <div class="content">${marked.parse(safeText)}</div>
  `;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  renderMathInElement(div, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
  });
}

async function sendMessage() {
  const raw = input.value;
  if (!raw) return;
  const message = raw;

  addMessage(raw, "user");

  input.value = "";

  const response = await fetch("http://vertai.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();

  const replyText =
    typeof data.reply === "string" ? data.reply : JSON.stringify(data.reply);

  addMessage(replyText, "bot");
}

sendBtn.addEventListener("click", sendMessage);

function clearChat() {
  if (confirm("Clear chat?")) {
    chatBox.innerHTML = "";
    localStorage.removeItem("chat-history");
  }
}

clearBtn.addEventListener("click", clearChat);