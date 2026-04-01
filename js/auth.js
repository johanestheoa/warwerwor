// ==========================================
// 1. KONEKSI KE SUPABASE
// ==========================================
// Menggunakan URL dan Anon Key milik johanestheoa's Project
const SUPABASE_URL = "https://rdlizjplkqkxnxkguekh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbGl6anBsa3FreG54a2d1ZWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMzAyODEsImV4cCI6MjA5MDYwNjI4MX0.rW4vUlQfipfn9nfcI4oB3TWBAblfoRwgXwBAFVu8xSM";

// Inisialisasi Client Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// 2. LOGIKA REGISTER
// ==========================================
// Mencari elemen form dengan ID 'form-register'
const registerForm = document.getElementById('form-register');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        // Mencegah browser refresh halaman saat tombol diklik
        e.preventDefault();

        // Mengambil data dari input berdasarkan atribut 'name'
        const username = document.getElementsByName('username')[0].value;
        const email = document.getElementsByName('email')[0].value;
        const tgl_lahir = document.getElementsByName('tgl_lahir')[0].value;
        const password = document.getElementsByName('password')[0].value;
        const re_password = document.getElementsByName('re_password')[0].value;

        // Validasi sederhana: Cek apakah password cocok
        if (password !== re_password) {
            alert("Konfirmasi password tidak cocok! Silakan periksa kembali.");
            return; // Berhenti di sini, jangan kirim ke database
        }

        // Menampilkan indikator loading (opsional)
        console.log("Sedang mendaftarkan user...");

        // Proses memasukkan data ke tabel 'users' di Supabase
        const { data, error } = await supabaseClient
            .from('users')
            .insert([
                { 
                    username: username, 
                    email: email, 
                    tgl_lahir: tgl_lahir, 
                    password: password 
                }
            ]);

        // Cek jika ada error dari server
        if (error) {
            console.error("Gagal menyimpan data:", error.message);
            alert("Pendaftaran Gagal: " + error.message);
        } else {
            // Jika berhasil
            alert("Selamat! Registrasi Berhasil.");
            // Pindahkan user ke halaman login
            window.location.href = "../pages/login.html";
        }
    });
}