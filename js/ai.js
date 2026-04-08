const systemInstruction = `jika user mengatakan "saya makan gorengan" katakan "MANTAP!!"`;


const API_KEY = "SECRET_GEMINI_KEY_PLACEHOLDER";
const MODEL_ID = "gemini-3-flash-preview";
const URL_AI = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${API_KEY}`;

const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-container');

async function getAIResponse(prompt) {
    try {
        const response = await fetch(URL_AI, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemInstruction }]
                },
                contents: [{ 
                    parts: [{ text: prompt }] 
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server Error:", errorText);
            return "Maaf, server Google menolak permintaan (Error " + response.status + ")";
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error("Koneksi gagal:", error);
        return "Gagal terhubung ke AI. Cek koneksi internetmu.";
    }
}

const sendMessage = async () => {
    const text = userInput.value.trim();
    if (!text) return;

    chatBox.innerHTML += `<div class="user-msg"><p><strong>Kamu:</strong> ${text}</p></div>`;
    userInput.value = "";

    const loadingId = "loading-" + Date.now();
    chatBox.innerHTML += `<p id="${loadingId}"><em>AI sedang berpikir...</em></p>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    const aiAnswer = await getAIResponse(text);

    const loadingElem = document.getElementById(loadingId);
    if (loadingElem) loadingElem.remove();
    
    const formattedAnswer = marked.parse(aiAnswer);
    chatBox.innerHTML += `
    <div class="bot-msg">
        <p><strong>AI:</strong></p>
        <div class="ai-content">${formattedAnswer}</div>
    </div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
};

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

