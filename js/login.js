// 1. KONEKSI KE SUPABASE
// Pastikan URL dan Key ini sama persis dengan yang ada di auth.js
const SUPABASE_URL = "https://rdlizjplkqkxnxkguekh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbGl6anBsa3FreG54a2d1ZWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMzAyODEsImV4cCI6MjA5MDYwNjI4MX0.rW4vUlQfipfn9nfcI4oB3TWBAblfoRwgXwBAFVu8xSM";

// Membuat jembatan koneksi
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. MENGAMBIL ELEMEN FORM
// JavaScript mencari form berdasarkan ID yang kamu buat di HTML
const loginForm = document.getElementById('form-login');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        // Mencegah halaman refresh otomatis
        e.preventDefault();

        // 3. MENGAMBIL DATA INPUT
        // Kita mengambil nilai berdasarkan atribut 'name' yang kamu tulis di HTML
        const usernameInput = document.getElementsByName('username')[0].value;
        const passwordInput = document.getElementsByName('password')[0].value;

        console.log("Memulai proses login untuk username:", usernameInput);

        // 4. PROSES PENGECEKAN KE DATABASE
        // Kita menyuruh Supabase mencari di tabel 'users'
        // .eq() artinya 'equal' (cari yang sama dengan...)
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('username', usernameInput) // Mencocokkan Username
            .eq('password', passwordInput) // Mencocokkan Password
            .single(); // Kita hanya butuh 1 data yang cocok

        // 5. PENANGANAN HASIL
        if (error || !data) {
            // Jika data tidak ditemukan atau password salah
            alert("Username atau Password salah!");
            console.error("Login gagal:", error ? error.message : "User tidak ada");
        } else {
            // JIKA BERHASIL:
            alert("Login Berhasil! Selamat datang, " + data.username);
            
            // Simpan status login di memori sementara browser (Session Storage)
            // Ini supaya halaman AI Chat nanti tahu kalau kamu sudah login
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('username', data.username);

            // Pindah otomatis ke halaman chat AI
            window.location.href = "ai-chat.html";
        }
    });
}