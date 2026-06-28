// =====================================
// AI CHAT JAVASCRIPT
// =====================================

const chatBox = document.getElementById("chat-box");
const questionInput = document.getElementById("question");
const sendBtn = document.getElementById("sendBtn");

// Suggested Questions
document.querySelectorAll(".suggestion").forEach(function(button) {
button.addEventListener("click", function() {
questionInput.value = button.innerText;
sendMessage();
});
});
// Enter Key Support
questionInput.addEventListener("keydown", function(e) {
if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
}
});
// Send Button
sendBtn.addEventListener("click", sendMessage);
// Main Function
async function sendMessage() {
const question = questionInput.value.trim();
if (!question) {
    return;
}
appendUser(question);
questionInput.value = "";
showTyping();
sendBtn.disabled = true;
try {
    const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            question: question
        })
    });
    const data = await response.json();
    removeTyping();
    if (data.answer) {
        appendAI(data.answer);
    } else {
        appendAI("⚠️ No response received from AI.");
    }
} catch (error) {
    removeTyping();
    appendAI("❌ Unable to contact AI server.");
    console.error(error);
}
sendBtn.disabled = false;
}
// User Message
function appendUser(text) {
const html =
    '<div class="message user">' +
        '<div class="avatar">👤</div>' +
        '<div class="bubble">' + text + '</div>' +
    '</div>';
chatBox.insertAdjacentHTML("beforeend", html);
scrollBottom();
}
// AI Message
function appendAI(text) {
const html =
    '<div class="message bot">' +
        '<div class="avatar">🤖</div>' +
        '<div class="bubble">' + text + '</div>' +
    '</div>';
chatBox.insertAdjacentHTML("beforeend", html);
scrollBottom();
}
// Typing Animation
function showTyping() {
const html =
    '<div class="message bot" id="typing">' +
        '<div class="avatar">🤖</div>' +
        '<div class="bubble">' +
            '<div class="typing">' +
                '<span></span>' +
                '<span></span>' +
                '<span></span>' +
            '</div>' +
        '</div>' +
    '</div>';

chatBox.insertAdjacentHTML("beforeend", html);

scrollBottom();
}
// Remove Typing
function removeTyping() {
const typing = document.getElementById("typing");

if (typing) {
    typing.remove();
}
}
// Auto Scroll
function scrollBottom() {
chatBox.scrollTop = chatBox.scrollHeight;
}
// Initial Load
window.onload = function() {
scrollBottom();
};