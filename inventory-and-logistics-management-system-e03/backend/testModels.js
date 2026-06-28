require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash-lite"];

(async () => {
    for (const m of models) {
        try {
            const r = await ai.models.generateContent({ model: m, contents: "Say OK" });
            console.log(m, "=> WORKS:", r.text.trim().substring(0, 30));
        } catch (e) {
            const msg = (e.message || "").toString();
            const isQuota = msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED");
            const is503 = msg.includes("503") || msg.includes("UNAVAILABLE");
            const code = isQuota ? "429-QUOTA" : is503 ? "503-BUSY" : "OTHER";
            console.log(m, "=> FAIL [" + code + "]:", msg.substring(0, 100));
        }
    }
})();
