const response = document.getElementById("response");
const question = document.getElementById("question");
const form = document.getElementById("questionForm");
const sendButton = form.querySelector(".send-btn");
let selectedMode = "tutor";

const modeMap = {
  "AI Tutor": "tutor",
  "Homework Helper": "homework",
  "Notes Maker": "notes",
  "Quiz Practice": "quiz",
  "PDF Study": "tutor",
  "Study Planner": "planner"
};

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

function showMessage(message, isError = false) {
  response.classList.add("show");
  response.innerHTML = (isError ? "<strong>StudyMate notice</strong><br>" : "<strong>StudyMate</strong><br>") + escapeHtml(message).replace(/\n/g, "<br>");
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const value = question.value.trim();
  if (!value) { question.focus(); return; }

  sendButton.disabled = true;
  sendButton.textContent = "…";
  showMessage("Thinking through your question…");

  try {
    const apiBase = window.STUDYMATE_API_URL || "";
    const result = await fetch(apiBase + "/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: value,
        mode: selectedMode,
        language: "English",
        level: "general"
      })
    });
    const data = await result.json().catch(() => ({}));
    if (!result.ok) throw new Error(data.detail || "Could not get an answer. Please try again.");
    showMessage(data.answer || "No answer was returned.");
  } catch (error) {
    const message = error instanceof TypeError
      ? "The AI server is not connected yet. Deploy the backend and configure its API key to enable live answers."
      : error.message;
    showMessage(message, true);
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "↑";
  }
});

document.querySelectorAll(".prompt-chips button").forEach(button => {
  button.addEventListener("click", () => { question.value = button.textContent; question.focus(); });
});

document.querySelectorAll(".tool-card").forEach(button => {
  button.addEventListener("click", () => {
    selectedMode = modeMap[button.dataset.tool] || "tutor";
    question.value = "Help me with " + button.dataset.tool.toLowerCase();
    document.getElementById("tutor").scrollIntoView({behavior:"smooth"});
    question.focus();
  });
});

document.getElementById("languageBtn").addEventListener("click", () => {
  showMessage("Language selection is coming in the next milestone. The first live tutor currently uses English.", true);
});
document.getElementById("year").textContent = new Date().getFullYear();
