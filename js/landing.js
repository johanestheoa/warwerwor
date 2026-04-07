const btnai = document.getElementById("chat-ai");
const btnfr = document.getElementById("forum-chat");

btnai.addEventListener('click', () => {
    window.location.href = '../pages/chatai.html';
});

btnfr.addEventListener('click', () => {
    window.location.href = '../pages/forum.html';
});