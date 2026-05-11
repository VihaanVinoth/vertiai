const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("deliver-btn");
const clearBtn = document.getElementById("clear-btn");

const supabaseUrl = "https://qnahvrzqewdgewdjqbef.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYWh2cnpxZXdkZ2V3ZGpxYmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTU3MzgsImV4cCI6MjA5NDA3MTczOH0.NJ6jqu2j1dir65HEPC6xVsgY5L-_PhtuPn9i2kAX-aM";

const loginBtn = document.getElementById("google-login");

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

const loginBtn = document.getElementById("google-login");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google"
    });
  });
}

async function checkUser() {
  const { data: { user } } = await supabase.auth.getUser();
  console.log(user);
}

checkUser();

console.log(user);

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

  const response = await fetch("http://localhost:3001/chat", {
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