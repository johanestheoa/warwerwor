// 1. Konfigurasi
const API_KEY = "AIzaSyAB3M0wQLIc2HjUj59gIONRz1MjcTHuDqU";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// 2. Tangkap Elemen HTML
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// 3. Fungsi untuk mengirim pesan ke AI
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
        // Mengambil teks jawaban dari struktur data Gemini
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error memanggil AI:", error);
        return "Maaf, sepertinya ada masalah koneksi ke AI.";
    }
}

// 4. Event Listener saat tombol diklik
sendBtn.addEventListener('click', async () => {
    const text = userInput.value;
    if (!text) return; // Jangan kirim kalau kosong

    // Tampilkan pesan user di layar
    chatBox.innerHTML += `<p><strong>Kamu:</strong> ${text}</p>`;
    userInput.value = ""; // Kosongkan input

    // Tampilkan status loading
    chatBox.innerHTML += `<p id="loading"><em>AI sedang berpikir...</em></p>`;

    // Ambil jawaban dari AI
    const aiAnswer = await getAIResponse(text);

    // Hapus tulisan loading dan tampilkan jawaban asli
    document.getElementById('loading').remove();
    chatBox.innerHTML += `<p><strong>AI:</strong> ${aiAnswer}</p>`;
    
    // Auto scroll ke bawah
    chatBox.scrollTop = chatBox.scrollHeight;
});