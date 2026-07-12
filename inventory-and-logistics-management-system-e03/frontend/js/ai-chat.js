// Capture script src at parse time (before DOMContentLoaded, when currentScript is still valid)
const _aiChatBase = (function() {
    const src = document.currentScript ? document.currentScript.src : "";
    return src ? src.replace(/\/js\/ai-chat\.js.*$/, "") : "";
})();

document.addEventListener("DOMContentLoaded", () => {
    // Load CSS - resolve relative to this script so it works on ALL pages
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = _aiChatBase ? _aiChatBase + "/css/ai-chat.css" : "css/ai-chat.css";
    document.head.appendChild(link);

    // Create UI
    const container = document.createElement("div");
    container.innerHTML = `
        <button class="ai-chat-btn" id="ai-chat-toggle">
            🤖 AI Assistant
        </button>
        <div class="ai-chat-panel" id="ai-chat-panel">
            <div class="ai-chat-header">
                <span>🤖 Inventory AI</span>
                <button id="ai-chat-close">&times;</button>
            </div>
            <div class="ai-chat-body" id="ai-chat-body">
                <div class="ai-message bot">Hello! I'm your AI Assistant. How can I help you today?</div>
            </div>
            <div class="ai-chat-footer">
                <input type="text" id="ai-chat-input" placeholder="Ask me anything..." />
                <button id="ai-chat-send">Send</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const toggleBtn = document.getElementById("ai-chat-toggle");
    const closeBtn = document.getElementById("ai-chat-close");
    const panel = document.getElementById("ai-chat-panel");
    const input = document.getElementById("ai-chat-input");
    const sendBtn = document.getElementById("ai-chat-send");
    const body = document.getElementById("ai-chat-body");

    toggleBtn.addEventListener("click", () => {
        panel.style.display = panel.style.display === "flex" ? "none" : "flex";
        if (panel.style.display === "flex") input.focus();
    });

    closeBtn.addEventListener("click", () => {
        panel.style.display = "none";
    });

    const sendMessage = async () => {
        const text = input.value.trim();
        if (!text) return;

        // Add user message
        const userMsg = document.createElement("div");
        userMsg.className = "ai-message user";
        userMsg.textContent = text;
        body.appendChild(userMsg);
        input.value = "";
        body.scrollTop = body.scrollHeight;

        // Loading state
        const loadingMsg = document.createElement("div");
        loadingMsg.className = "ai-message bot";
        loadingMsg.innerHTML = `<span style="display:inline-block; width:12px; height:12px; border:2px solid currentColor; border-bottom-color:transparent; border-radius:50%; animation:rotation 1s linear infinite;"></span> Thinking...`;
        body.appendChild(loadingMsg);
        body.scrollTop = body.scrollHeight;

        input.disabled = true;
        sendBtn.disabled = true;

        try {
            const res = await fetch("https://inventory-and-logistics-management-system.onrender.com/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            
            loadingMsg.remove();

            const botMsg = document.createElement("div");
            botMsg.className = "ai-message bot";
            
            if (!res.ok) {
                botMsg.innerHTML = `⚠️ <strong style="color:var(--accent-red);">${data.error || "Network error. Please try again."}</strong>`;
            } else if (data.error) {
                botMsg.textContent = "Error: " + data.error;
            } else {
                botMsg.textContent = data.reply;
            }
            body.appendChild(botMsg);
            body.scrollTop = body.scrollHeight;

        } catch (err) {
            loadingMsg.remove();
            const botMsg = document.createElement("div");
            botMsg.className = "ai-message bot";
            // Show more specific error info
            const errMsg = err.message && err.message !== 'Failed to fetch' 
                ? err.message 
                : "Cannot connect to the server. Make sure the backend is running on port 5000.";
            botMsg.innerHTML = `⚠️ <strong style="color:var(--accent-red);">${errMsg}</strong>`;
            body.appendChild(botMsg);
            body.scrollTop = body.scrollHeight;
        } finally {
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }
    };

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});
