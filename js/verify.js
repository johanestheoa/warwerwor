// Inisialisasi Supabase di verify.js juga
const SUPABASE_URL = "https://rdlizjplkqkxnxkguekh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function validateOTP() {
    const inputOtp = document.getElementById('otp-input').value;
    const pendingData = JSON.parse(localStorage.getItem('pending_user'));

    if (pendingData && inputOtp === pendingData.otp) {
        
        // --- OTP COCOK! SEKARANG SIMPAN KE SUPABASE ---
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
            window.location.href = "login.html";
        }
    } else {
        alert("Kode OTP salah!");
    }
}