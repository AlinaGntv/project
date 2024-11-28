// Функция для отображения тоста
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');

        // Убираем тост через 3 секунды
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginCloseButton = document.getElementById("login-close");
    const registerCloseButton = document.getElementById("register-close");
    const dashboardLink = document.querySelector('a[href="dashboard.html"]');

        // Открытие модальных окон (примеры для кнопок "Войти" и "Регистрация")
    document.getElementById("login-btn").onclick = function() {
        loginModal.style.display = 'flex';
    }

    document.getElementById("register-btn").onclick = function() {
        registerModal.style.display = 'flex';
    }

    // Закрытие модальных окон при нажатии на кнопку закрытия
    loginCloseButton.onclick = function() {
        loginModal.style.display = 'none';
    }

    registerCloseButton.onclick = function() {
        registerModal.style.display = 'none';
    }

    // Закрытие модального окна при клике за пределами окна
    window.onclick = function(event) {
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
        } else if (event.target == registerModal) {
            registerModal.style.display = 'none';
        }
    }
    

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');

    if (isLoggedIn) {
        if (dashboardLink) dashboardLink.style.display = 'inline';
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
    } else {
        if (dashboardLink) dashboardLink.style.display = 'none';
    }

    if (loginBtn && loginModal) {
        loginBtn.onclick = function () {
            loginModal.style.display = 'flex';
        };

        const closeLogin = loginModal.querySelector('.close');
        closeLogin.onclick = function () {
            loginModal.style.display = 'none';
        };

        const loginForm = loginModal.querySelector('form');
        loginForm.onsubmit = function (event) {
            event.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            if (email && password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                showToast('Вы успешно вошли!');
                loginModal.style.display = 'none';
                location.reload();
            } else {
                showToast('Пожалуйста, введите корректные данные.');
            }
        };
    }

    if (registerBtn && registerModal) {
        registerBtn.onclick = function () {
            registerModal.style.display = 'flex';
        };

        const closeRegister = registerModal.querySelector('.close');
        closeRegister.onclick = function () {
            registerModal.style.display = 'none';
        };

        const registerForm = registerModal.querySelector('form');
        registerForm.onsubmit = function (event) {
            event.preventDefault();
            const email = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelector('input[type="password"]').value;
            const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;

            if (password !== confirmPassword) {
                showToast('Пароли не совпадают!');
                return;
            }

            if (email && password) {
                showToast('Регистрация успешна! Войдите в свой аккаунт.');
                registerModal.style.display = 'none';
            } else {
                showToast('Пожалуйста, введите корректные данные.');
            }
        };
    }

    if (window.location.pathname.endsWith('dashboard.html')) {
        if (!isLoggedIn) {
            showToast('Вы не авторизованы. Пожалуйста, войдите или зарегистрируйтесь.');
            window.location.href = 'index.html';
        } else {
            const logoutBtn = document.getElementById('logout-btn');
            const userEmailSpan = document.getElementById('user-email');

            if (userEmailSpan) {
                userEmailSpan.textContent = userEmail;
            }

            if (logoutBtn) {
                logoutBtn.onclick = function () {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userEmail');
                    showToast('Вы вышли из аккаунта.');
                    window.location.href = 'index.html';
                };
            }
        }
    }
});
