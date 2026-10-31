const response = document.getElementById("response");
const question = document.getElementById("question");
const form = document.getElementById("questionForm");

function showPreview(text) {
  response.classList.add("show");
  response.innerHTML = "<strong>StudyMate preview</strong><br>" +
    "Your question: “" + escapeHtml(text) + "”<br><br>" +
    "The learning interface is ready. To provide real AI answers, the next development step is connecting a secure AI API through a backend. Your API key should never be placed in this browser code.";
}
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const value = question.value.trim();
  if (!value) { question.focus(); return; }
  showPreview(value);
});
document.querySelectorAll(".prompt-chips button").forEach(button => {
  button.addEventListener("click", () => { question.value = button.textContent; question.focus(); });
});
document.querySelectorAll(".tool-card").forEach(button => {
  button.addEventListener("click", () => {
    question.value = "Help me with " + button.dataset.tool.toLowerCase();
    document.getElementById("tutor").scrollIntoView({behavior:"smooth"});
    question.focus();
  });
});
document.getElementById("languageBtn").addEventListener("click", () => {
  alert("More Indian languages will be added in the next development phase.");
});
document.getElementById("year").textContent = new Date().getFullYear();