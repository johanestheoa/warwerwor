// 1. Konfigurasi
const API_KEY = "AIzaSyAB3M0wQLIc2HjUj59gIONRz1MjcTHuDqU"; // Gunakan Key kamu
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Ambil nama dari sessionStorage (hasil login tadi)
const savedUsername = sessionStorage.getItem('username');
if (savedUsername) {
    document.getElementById('display-username').innerText = savedUsername;
}

// 2. Tangkap Elemen HTML (DISESUAIKAN)
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-container'); // Ganti dari chat-box ke chat-container

// 3. Fungsi untuk mengirim pesan ke AI (Sudah Benar)
async function getAIResponse(prompt) {
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        // Cek jika API mengembalikan error (misal key salah)
        if (data.error) {
            return "Error: " + data.error.message;
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error memanggil AI:", error);
        return "Maaf, sepertinya ada masalah koneksi ke AI.";
    }
}

// 4. Event Listener (Sudah Benar, tinggal pastikan chatBox terhubung)
sendBtn.addEventListener('click', async () => {
    const text = userInput.value;
    if (!text) return;

    // Tampilkan pesan user
    chatBox.innerHTML += `<div class="user-msg"><p><strong>Kamu:</strong> ${text}</p></div>`;
    userInput.value = ""; 

    // Tampilkan loading
    const loadingId = "loading-" + Date.now(); // ID unik supaya tidak bentrok
    chatBox.innerHTML += `<p id="${loadingId}"><em>AI sedang berpikir...</em></p>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    const aiAnswer = await getAIResponse(text);

    // Hapus loading dan tampilkan jawaban
    const loadingElem = document.getElementById(loadingId);
    if (loadingElem) loadingElem.remove();
    
    chatBox.innerHTML += `<div class="bot-msg"><p><strong>AI:</strong> ${aiAnswer}</p></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
});