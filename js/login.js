const SUPABASE_URL = "https://rdlizjplkqkxnxkguekh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbGl6anBsa3FreG54a2d1ZWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMzAyODEsImV4cCI6MjA5MDYwNjI4MX0.rW4vUlQfipfn9nfcI4oB3TWBAblfoRwgXwBAFVu8xSM";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const loginForm = document.getElementById('form-login');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usernameInput = document.getElementsByName('username')[0].value;
        const passwordInput = document.getElementsByName('password')[0].value;

        console.log("Memulai proses login untuk username:", usernameInput);

        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('username', usernameInput)
            .eq('password', passwordInput)
            .single();

            if (error || !data) {
            alert("Username atau Password salah!");
            console.error("Login gagal:", error ? error.message : "User tidak ada");
        } else {
            alert("Login Berhasil! Selamat datang, " + data.username);
            
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('username', data.username);

            window.location.href = "chatai.html";
        }
    });
}