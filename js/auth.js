// ==========================================
// 1. KONEKSI KE SUPABASE & EMAILJS
// ==========================================
const SUPABASE_URL = "https://rdlizjplkqkxnxkguekh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbGl6anBsa3FreG54a2d1ZWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMzAyODEsImV4cCI6MjA5MDYwNjI4MX0.rW4vUlQfipfn9nfcI4oB3TWBAblfoRwgXwBAFVu8xSM"; // Gunakan Key aslimu
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Inisialisasi EmailJS
(function() {
    emailjs.init("R0UzgXsVVaddINieD"); // Public Key kamu
})();

const registerForm = document.getElementById('form-register');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ambil Data Input
        const username = document.getElementsByName('username')[0].value;
        const email = document.getElementsByName('email')[0].value;
        const tgl_lahir = document.getElementsByName('tgl_lahir')[0].value;
        const password = document.getElementsByName('password')[0].value;
        const re_password = document.getElementsByName('re_password')[0].value;

        if (password !== re_password) {
            alert("Konfirmasi password tidak cocok!");
            return;
        }

        // --- PROSES OTP ---
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryTime = new Date(new Date().getTime() + 15 * 60000).toLocaleTimeString();

        const templateParams = {
            to_email: email,
            passcode: otp,
            time: expiryTime
        };

        try {
            // 1. Kirim Email dulu
            await emailjs.send("service_w4omikj", "template_p6a0nnp", templateParams);
            
            // 2. Simpan semua data (termasuk OTP) ke LocalStorage sementara
            const pendingUser = { 
                username, email, tgl_lahir, password, otp 
            };
            localStorage.setItem('pending_user', JSON.stringify(pendingUser));

            alert("OTP terkirim! Silakan cek email kamu.");
            window.location.href = "../pages/verify.html"; // Ke halaman verifikasi
            
        } catch (err) {
            console.error("Gagal kirim email:", err);
            alert("Gagal mengirim kode verifikasi.");
        }
    });
}