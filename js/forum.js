const SUPABASE_URL = "https://rdlizjplkqkxnxkguekh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbGl6anBsa3FreG54a2d1ZWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMzAyODEsImV4cCI6MjA5MDYwNjI4MX0.rW4vUlQfipfn9nfcI4oB3TWBAblfoRwgXwBAFVu8xSM"; // Gunakan Key aslimu
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Variabel Global untuk menyimpan data user yang login
let currentUser = null;

// 2. Fungsi Ambil Data User yang Sedang Login
async function checkUser() {
    const { data: { user }, error } = await _supabase.auth.getUser();

    if (error || !user) {
        alert("Silakan login terlebih dahulu!");
        window.location.href = 'login.html'; // Lempar ke halaman login jika belum login
        return;
    }

    currentUser = user;
    // Tampilkan nama user di UI (dari metadata saat register)
    document.getElementById('display-name').innerText = user.user_metadata.full_name || "User";
    
    // Setelah user dipastikan ada, baru muat postingan lama
    loadPosts();
}

// 3. Fungsi Ambil Postingan dari Database
async function loadPosts() {
    const { data, error } = await _supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Gagal mengambil data:", error.message);
        return;
    }

    const feed = document.getElementById('forum-feed');
    feed.innerHTML = ''; // Bersihkan tulisan "Memuat..."
    
    data.forEach(post => {
        appendPostToUI(post);
    });
}

// 4. Fungsi Kirim Postingan Baru
async function sendPost(e) {
    e.preventDefault();
    const contentInput = document.getElementById('post-content');
    const content = contentInput.value;

    if (!content.trim()) return;

    const { error } = await _supabase
        .from('posts')
        .insert([
            { 
                user_id: currentUser.id, 
                username: currentUser.user_metadata.full_name, 
                content: content 
            }
        ]);

    if (error) {
        alert("Gagal mengirim postingan: " + error.message);
    } else {
        contentInput.value = ''; // Kosongkan textarea setelah berhasil
    }
}

// 5. Fungsi Render HTML Postingan (Reusable)
function appendPostToUI(post) {
    const feed = document.getElementById('forum-feed');
    const date = new Date(post.created_at).toLocaleString('id-ID');

    const postHTML = `
        <div class="post-card">
            <strong>@${post.username}</strong>
            <p>${post.content}</p>
            <small>${date}</small>
        </div>
    `;
    
    // Masukkan ke paling atas (karena kita ingin yang terbaru di atas)
    feed.insertAdjacentHTML('afterbegin', postHTML);
}

// 6. FITUR REALTIME: Update otomatis saat ada user lain yang posting
_supabase
    .channel('public:posts')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, payload => {
        appendPostToUI(payload.new); // Langsung munculkan di layar tanpa refresh
    })
    .subscribe();

// Event Listener untuk Form
document.getElementById('forum-form').addEventListener('submit', sendPost);

// Jalankan pengecekan user saat halaman dibuka
checkUser();