const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const closeLogin = document.getElementById('close-login');
const closeRegister = document.getElementById('close-register');



loginBtn.onclick = function() {
    loginModal.style.display = 'flex';
}

registerBtn.onclick = function() {
    registerModal.style.display = 'flex';
}

closeLogin.onclick = function() {
    loginModal.style.display = 'none';
}

closeRegister.onclick = function() {
    registerModal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target == registerModal) {
        registerModal.style.display = 'none';
    }
}
