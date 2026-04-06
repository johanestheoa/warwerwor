
const SUPABASE_URL = "https://rdlizjplkqkxnxkguekh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbGl6anBsa3FreG54a2d1ZWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMzAyODEsImV4cCI6MjA5MDYwNjI4MX0.rW4vUlQfipfn9nfcI4oB3TWBAblfoRwgXwBAFVu8xSM"; // Gunakan Key aslimu
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function validateOTP() {
    const inputOtp = document.getElementById('otp-input').value;
    const pendingData = JSON.parse(localStorage.getItem('pending_user'));

    if (pendingData && inputOtp === pendingData.otp) {
        
        const { data, error } = await supabaseClient
            .from('users')
            .insert([
                { 
                    username: pendingData.username, 
                    email: pendingData.email, 
                    tgl_lahir: pendingData.tgl_lahir, 
                    password: pendingData.password 
                }
            ]);

        if (error) {
            alert("Gagal daftar ke database: " + error.message);
        } else {
            localStorage.removeItem('pending_user');
            alert("Verifikasi Berhasil & Data Tersimpan! Silakan Login.");
            window.location.href = "../pages/login.html";
        }
    } else {
        alert("Kode OTP salah!");
    }
}