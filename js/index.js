document.addEventListener('DOMContentLoaded', () => {
    const usersKey = 'registeredUsers';
    const adminAccount = { email: 'admin@gmail.com', password: 'Admin1' };
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const dashboardLink = document.querySelector('a[href="dashboard.html"]');
    const createOrderBtn = document.getElementById('create-order-btn');
    const ordersContainer = document.getElementById('orders-container');
    const refreshOrdersBtn = document.getElementById('refresh-orders-btn');

    const messageForm = document.getElementById('message-form');
    if (messageForm) {
        messageForm.onsubmit = function (event) {
            event.preventDefault();

            const userEmail = localStorage.getItem('userEmail');
            const message = document.getElementById('message').value;

            if (userEmail && message) {
                const messages = JSON.parse(localStorage.getItem('userMessages')) || [];
                messages.push({ email: userEmail, message, createdAt: new Date().toISOString() });
                localStorage.setItem('userMessages', JSON.stringify(messages));

                showToast('Ваше сообщение отправлено администратору.');
                document.getElementById('message').value = '';
            } else {
                showToast('Ошибка: Не удалось отправить сообщение.');
            }
        };
    }

    function loadMessages() {
        const messagesContainer = document.getElementById('messages-container');
        const messages = JSON.parse(localStorage.getItem('userMessages')) || [];
    
        if (!messagesContainer) {
            console.warn('Контейнер для сообщений не найден.');
            return;
        }
    
        messagesContainer.innerHTML = '';
        if (messages.length === 0) {
            messagesContainer.innerHTML = '<p>Нет новых сообщений от пользователей.</p>';
            return;
        }
    
        messages.forEach((msg, index) => {
            const messageRow = document.createElement('div');
            messageRow.innerHTML = `
                <p><strong>Email:</strong> ${msg.email}</p>
                <p><strong>Сообщение:</strong> ${msg.message}</p>
                <p><strong>Дата:</strong> ${new Date(msg.createdAt).toLocaleString()}</p>
                <button class="delete-message-btn" data-index="${index}">Удалить</button>
                <hr>
            `;
            messagesContainer.appendChild(messageRow);
        });
    
        messagesContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-message-btn')) {
                const index = event.target.getAttribute('data-index');
                messages.splice(index, 1);
                localStorage.setItem('userMessages', JSON.stringify(messages));
                loadMessages();
            }
        });
    }
    
    if (window.location.pathname.endsWith('/admin-dashboard.html')) {
        loadMessages();
    }    

    const addressForm = document.getElementById('address-form');
    function loadSavedAddress() {
        console.log('Вызвана функция loadSavedAddress');
        const savedAddress = JSON.parse(localStorage.getItem('userAddress'));
        console.log('Данные в localStorage:', savedAddress);
    
        const savedAddressElement = document.getElementById('saved-address');
        const savedCityElement = document.getElementById('saved-city');
        const savedPostalCodeElement = document.getElementById('saved-postal-code');
    
        if (!savedAddressElement || !savedCityElement || !savedPostalCodeElement) {
            console.warn('Элементы для сохранённого адреса не найдены в DOM.');
            return;
        }
    
        if (savedAddress) {
            console.log('Отображение данных из localStorage...');
            savedAddressElement.textContent = savedAddress.address || '-';
            savedCityElement.textContent = savedAddress.city || '-';
            savedPostalCodeElement.textContent = savedAddress.postalCode || '-';
        } else {
            console.warn('Сохранённый адрес отсутствует в localStorage.');
            savedAddressElement.textContent = '-';
            savedCityElement.textContent = '-';
            savedPostalCodeElement.textContent = '-';
        }
    }
    
    if (addressForm) {
        addressForm.onsubmit = function (event) {
            event.preventDefault();

            // Получаем значения из полей формы
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const postalCode = document.getElementById('postal-code').value;

            // Проверяем, заполнены ли все поля
            if (address && city && postalCode) {
                const newAddress = { address, city, postalCode };
                localStorage.setItem('userAddress', JSON.stringify(newAddress));
                const adminSizes = JSON.parse(localStorage.getItem('admin_sizes')) || {};
                if (!adminSizes[userEmail]) {
                    adminSizes[userEmail] = {};
                }
                adminSizes[userEmail].address = newAddress;
                localStorage.setItem('admin_sizes', JSON.stringify(adminSizes));

                showToast('Адрес успешно сохранен!');
                document.getElementById('saved-address').textContent = address;
                document.getElementById('saved-city').textContent = city;
                document.getElementById('saved-postal-code').textContent = postalCode;
            } else {
                showToast('Пожалуйста, заполните все поля.');
            }
        };
    } else {
        console.warn('Элемент с ID "address-form" не найден.');
    }

    loadSavedAddress();
    
    let orders = [];
    
    if (createOrderBtn) {
        createOrderBtn.addEventListener('click', function () {
            const userEmail = localStorage.getItem('userEmail');
            const userSizesKey = `sizes_${userEmail}`;
            const savedSizes = JSON.parse(localStorage.getItem(userSizesKey)) || {};
    
            if (!savedSizes.height || !savedSizes.chest || !savedSizes.waist || !savedSizes.hips) {
                showToast('Вы должны заполнить все мерки в личном кабинете, прежде чем создавать заказ.');
                return;
            }

            const savedAddress = JSON.parse(localStorage.getItem('userAddress'));
            if (!savedAddress || !savedAddress.address || !savedAddress.city || !savedAddress.postalCode) {
                showToast('Вы должны сохранить адрес в личном кабинете, прежде чем создавать заказ.');
                return;
            }
    
            const selectedModel = document.getElementById('modelSelect').value;
            const color = document.getElementById('color').value;
            const material = document.getElementById('material').value;
            const style = document.getElementById('style').value;

            if (!selectedModel || !color || !material || !style) {
                console.error('Не все поля заказа заполнены!');
                return;
            }
    
            const newOrder = {
                id: Date.now(),
                model: selectedModel,
                color,
                material,
                style,
                status: 'Обрабатывается',
                createdAt: new Date().toISOString(),
            };
    
            const orderKey = `order_${localStorage.getItem('userEmail')}_${Date.now()}`;
            localStorage.setItem(orderKey, JSON.stringify(newOrder));
            console.log('Заказ создан:', newOrder);
            showToast('Ваш заказ создан и отправлен на обработку!');
        });
    } else {
        console.warn('Кнопка с ID "create-order-btn" не найдена. Проверьте HTML.');
    }
    
    const modals = document.querySelectorAll('.modal');
    const refreshButton = document.getElementById('refresh-orders-btn');
    if (refreshButton) {
        refreshButton.addEventListener('click', loadOrders);
    }
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const orderMessage = document.getElementById('order-message');
    const orderKey = `order_${localStorage.getItem('userEmail')}`;

    let registeredUsers = JSON.parse(localStorage.getItem(usersKey)) || [];
    window.usersKey = 'registeredUsers';

    const isAdminExists = registeredUsers.some(user => user.email === adminAccount.email);
    if (!isAdminExists) {
        registeredUsers.push(adminAccount);
        localStorage.setItem(usersKey, JSON.stringify(registeredUsers));
        console.log('Учетная запись администратора добавлена.');
    } else {
        console.log('Учетная запись администратора уже существует.');
    }

    console.log('Зарегистрированные пользователи:', registeredUsers);

    if (!localStorage.getItem(usersKey)) {
        localStorage.setItem(usersKey, JSON.stringify([]));
    }
    
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
        if (loginForm) {
            loginForm.onsubmit = function (event) {
                event.preventDefault();
                const email = loginForm.querySelector('input[type="email"]').value;
                const password = loginForm.querySelector('input[type="password"]').value;
    
                const registeredUsers = JSON.parse(localStorage.getItem(usersKey)) || [];
                const userExists = registeredUsers.find(user => user.email === email);
    
                if (userExists && userExists.password === password) {
                    if (email === adminAccount.email && password === adminAccount.password) {
                        localStorage.setItem('isAdmin', 'true');
                        window.location.href = 'admin-dashboard.html'; 
                    } else {
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('userEmail', email);
                        showToast('Вы успешно вошли!');
                        loginModal.style.display = 'none';
                        location.reload();
                    }
                } else if (userExists) {
                    showToast('Неверный пароль. Пожалуйста, попробуйте снова.');
                } else {
                    showToast('Такого пользователя не существует. Проверьте введенные данные или зарегистрируйтесь.');
                }
            };
        }   
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

            if (!validateEmail(email)) {
                showToast('Введите корректный email в формате example@gmail.com.');
                return;
            }

            if (!validatePassword(password)) {
                showToast('Пароль должен быть минимум 8 символов, содержать одну заглавную букву и одну цифру.');
                return;
            }

            if (password !== confirmPassword) {
                showToast('Пароли не совпадают!');
                return;
            }

            const registeredUsers = JSON.parse(localStorage.getItem(usersKey)) || [];   
            if (!registeredUsers.some(user => user.email === adminAccount.email)) {
                registeredUsers.push(adminAccount);
                localStorage.setItem(usersKey, JSON.stringify(registeredUsers));
            }

            const loginModal = document.getElementById('loginModal');
            const loginForm = loginModal ? loginModal.querySelector('form') : null;

            const userExists = registeredUsers.find(user => user.email === email);
            if (userExists) {
                showToast('Этот email уже зарегистрирован.');
                return;
            }

            if (email && password) {
                registeredUsers.push({ email, password });
                localStorage.setItem(usersKey, JSON.stringify(registeredUsers));
                showToast('Регистрация успешна! Войдите в свой аккаунт.');
                registerModal.style.display = 'none';
            } else {
                showToast('Пожалуйста, введите корректные данные.');
            }

            function validateEmail(email) {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailRegex.test(email);
            }
        
            function validatePassword(password) {
                const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
                return passwordRegex.test(password);
            }
        };
    }

    if (window.location.pathname.endsWith('/dashboard.html')) {
        
    const modelSelect = document.getElementById('modelSelect');
    const colorInput = document.getElementById('color');
    const materialSelect = document.getElementById('material');
    const styleSelect = document.getElementById('style');
    const modelSettingsForm = document.getElementById('model-settings');
    const userModelsKey = `models_${localStorage.getItem('userEmail')}`;
    const savedModels = JSON.parse(localStorage.getItem(userModelsKey)) || {};

    function loadModelSettings() {
        if (!modelSelect) {
            console.warn('Элемент modelSelect не найден.');
            return;
        } 
        const selectedModel = modelSelect.value;
        const modelSettings = savedModels[selectedModel] || {};
        colorInput.value = modelSettings.color || '#ffffff';
        materialSelect.value = modelSettings.material || 'cotton';
        styleSelect.value = modelSettings.style || 'casual';
    }

    if (modelSelect) {
            modelSelect.addEventListener('change', loadModelSettings);
        }

    if (modelSettingsForm) {
        modelSettingsForm.onsubmit = function (event) {
            event.preventDefault();

            const selectedModel = modelSelect.value;
            const newSettings = {
                color: colorInput.value,
                material: materialSelect.value,
                style: styleSelect.value,
            };

            savedModels[selectedModel] = newSettings;
            localStorage.setItem(userModelsKey, JSON.stringify(savedModels));
            showToast(`Настройки для ${selectedModel} сохранены!`);
        };
    }

    loadModelSettings();

        if (!isLoggedIn) {
            showToast('Вы не авторизованы. Пожалуйста, войдите или зарегистрируйтесь.');
            window.location.href = 'index.html';
        } else {
            const logoutBtn = document.getElementById('logout-btn');
            const userEmailSpan = document.getElementById('user-email');
            const sizeForm = document.getElementById('size-form');
            const sizeList = document.getElementById('size-list');
    
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
    
            const userSizesKey = `sizes_${userEmail}`;
            const savedSizes = JSON.parse(localStorage.getItem(userSizesKey)) || {};
    
            const savedHeight = document.getElementById('saved-height');
            const savedChest = document.getElementById('saved-chest');
            const savedWaist = document.getElementById('saved-waist');
            const savedHips = document.getElementById('saved-hips');
    
            function loadSizes() {
                savedHeight.textContent = savedSizes.height || '-';
                savedChest.textContent = savedSizes.chest || '-';
                savedWaist.textContent = savedSizes.waist || '-';
                savedHips.textContent = savedSizes.hips || '-';
            }
    
            loadSizes();
    
            sizeForm.onsubmit = function (event) {
                event.preventDefault();
            
                const height = document.getElementById('height').value;
                const chest = document.getElementById('chest').value;
                const waist = document.getElementById('waist').value;
                const hips = document.getElementById('hips').value;
            
                if (height && chest && waist && hips) {
                    const newSizes = { height, chest, waist, hips };
                    localStorage.setItem(userSizesKey, JSON.stringify(newSizes));
            
                    // Добавляем данные в общий ключ admin_sizes
                    const adminSizes = JSON.parse(localStorage.getItem('admin_sizes')) || {};
                    adminSizes[userEmail] = newSizes;
                    localStorage.setItem('admin_sizes', JSON.stringify(adminSizes));
            
                    showToast('Размеры успешно сохранены!');
                    Object.assign(savedSizes, newSizes);
                    loadSizes();
                } else {
                    showToast('Пожалуйста, заполните все поля.');
                }
            };            
            }
        }

    if (window.location.pathname.endsWith('/admin-dashboard.html')) {
        function loadOrders() {
            orders = [];

            if (!ordersContainer) {
                console.warn('Контейнер для заказов не найден.');
                return;
            }

            ordersContainer.innerHTML = '';
            let hasOrders = false;

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('order_')) {
                    const order = JSON.parse(localStorage.getItem(key));
                    if (validateOrder(order)) {
                        hasOrders = true;
                        const orderRow = document.createElement('div');
                        orderRow.innerHTML = `
                            <p><strong>Email клиента:</strong> ${key.replace('order_', '')}</p>
                            <p><strong>Модель:</strong> ${order.model}</p>
                            <p><strong>Цвет:</strong> ${order.color}</p>
                            <p><strong>Материал:</strong> ${order.material}</p>
                            <p><strong>Стиль:</strong> ${order.style}</p>
                            <p><strong>Статус:</strong>
                            <select id="status-${order.id}" class="status-select">
                                <option value="Обрабатывается" ${order.status === 'Обрабатывается' ? 'selected' : ''}>Обрабатывается</option>
                                <option value="Передан в доставку" ${order.status === 'Передан в доставку' ? 'selected' : ''}>Передан в доставку</option>
                                <option value="Выполнен" ${order.status === 'Выполнен' ? 'selected' : ''}>Выполнен</option>
                                <option value="Отменен" ${order.status === 'Отменен' ? 'selected' : ''}>Отменен</option>
                            </select>
                            <button class="update-status-btn" data-key="${key}">Обновить статус</button>
                            <button class="delete-order-btn" data-key="${key}">Удалить заказ</button>
                            </p>
                            <hr>
                        `;
                        ordersContainer.appendChild(orderRow);
                    }
                }
            }

            if (!hasOrders) {
                ordersContainer.innerHTML = '<p>На данный момент заказов нет.</p>';
            }
        }

        function loadUserSizes() {
            const adminSizes = JSON.parse(localStorage.getItem('admin_sizes')) || {};
            const sizesContainer = document.getElementById('sizes-container');
    
            if (!sizesContainer) {
                console.warn('Контейнер для мерок не найден.');
                return;
            }
    
            sizesContainer.innerHTML = ''; 
    
            if (Object.keys(adminSizes).length === 0) {
                sizesContainer.innerHTML = '<p>Нет сохраненных данных пользователей.</p>';
                return;
            }
    
            for (const [email, data] of Object.entries(adminSizes)) {
                const { height, chest, waist, hips, address } = data;
                const { address: addr, city, postalCode } = address || {};
    
                const userRow = document.createElement('div');
                userRow.innerHTML = `
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Рост:</strong> ${height || '-'}</p>
                    <p><strong>Грудь:</strong> ${chest || '-'}</p>
                    <p><strong>Талия:</strong> ${waist || '-'}</p>
                    <p><strong>Бедра:</strong> ${hips || '-'}</p>
                    <p><strong>Адрес:</strong> ${addr || '-'}</p>
                    <p><strong>Город:</strong> ${city || '-'}</p>
                    <p><strong>Почтовый индекс:</strong> ${postalCode || '-'}</p>
                    <hr>
                `;
                sizesContainer.appendChild(userRow);
            }
        }
    
        loadUserSizes();

        loadUserSizes();

        function updateOrderStatus(orderKey, newStatus) {
            const order = JSON.parse(localStorage.getItem(orderKey));
            if (order) {
                order.status = newStatus;
                localStorage.setItem(orderKey, JSON.stringify(order));
                showToast('Статус заказа успешно обновлен.');
                loadOrders(); 
            } else {
                console.error('Ошибка: Заказ с указанным ключом не найден.');
            }
        }                       
        

        function deleteOrder(orderKey) {
            if (localStorage.getItem(orderKey)) {
                localStorage.removeItem(orderKey); 
                showToast('Заказ успешно удален.');
                loadOrders(); 
            } else {
                console.error(`Ошибка: Заказ с ключом "${orderKey}" не найден в localStorage.`);
                showToast('Ошибка: Заказ не найден.');
            }
        }               

        ordersContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-order-btn')) {
                const orderKey = event.target.getAttribute('data-key'); 
        
                if (!orderKey) {
                    console.error('Ошибка: Ключ заказа отсутствует в data-key атрибуте.');
                    showToast('Ошибка: Не удалось определить ключ заказа.');
                    return;
                }
        
                const order = JSON.parse(localStorage.getItem(orderKey));
                if (!order) {
                    console.error(`Ошибка: Заказ с ключом "${orderKey}" не найден.`);
                    showToast('Ошибка: Заказ не найден.');
                    return;
                }
        
                deleteOrder(orderKey); 
            }
        
            if (event.target.classList.contains('update-status-btn')) {
                const orderKey = event.target.getAttribute('data-key');
                const order = JSON.parse(localStorage.getItem(orderKey));
        
                if (!order || !order.id) {
                    console.error('Ошибка: Заказ или ID заказа не найден.');
                    return;
                }

                const statusSelect = document.querySelector(`#status-${order.id}`);
                if (statusSelect) {
                    updateOrderStatus(orderKey, statusSelect.value);
                } else {
                    console.error(`Ошибка: Селектор статуса для заказа ${order.id} не найден.`);
                }
            }
        });
                                                                          


        if (refreshOrdersBtn) {
            refreshOrdersBtn.addEventListener('click', loadOrders);
        }

        function validateOrder(order) {
            return order && order.id && order.model && order.status;
        }

        loadOrders();

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');

                window.location.href = 'index.html';
            });
        } else {
            console.warn('Кнопка "Выйти" с ID "logoutButton" не найдена.');
        }
    }
    
    modals.forEach(modal => {
        const closeButton = modal.querySelector('.close');
        if (closeButton) {
            closeButton.onclick = () => {
                modal.style.display = 'none';
            };
        }

        modal.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    });

    function deleteOrder(orderKey) {
        if (localStorage.getItem(orderKey)) {
            localStorage.removeItem(orderKey);
            showToast('Заказ успешно удален.');
            loadOrders(); 
        } else {
            console.error('Ошибка: Заказ с указанным ключом не найден.');
        }
    }
      
    function showToast(message) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    function loadOrderStatus() {
        if (!orderMessage) {
            console.warn('Элемент "order-message" не найден. Код не будет выполнен.');
            return;
        }
    
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            orderMessage.textContent = 'Вы не авторизованы.';
            return;
        }
    
        const orders = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`order_${userEmail}_`)) {
                const order = JSON.parse(localStorage.getItem(key));
                if (order) {
                    orders.push(order);
                }
            }
        }
    
        if (orders.length > 0) {
            orderMessage.innerHTML = orders
                .map(order =>   
                    `Ваш заказ: ${order.model} (${order.style}, ${order.color}, ${order.material}). Статус: ${order.status}`)
                .join('<br>');
        } else {
            orderMessage.textContent = 'Нет активных заказов.';
        }
    }
    

    if (window.location.pathname.endsWith('/dashboard.html')) {
        loadOrderStatus();
    }
    console.log(localStorage.getItem(`order_${localStorage.getItem('userEmail')}`));
});

