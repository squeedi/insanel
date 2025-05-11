document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');
    const orderModal = document.getElementById('orderModal');
    const orderItemsList = document.getElementById('order-items-list');
    const orderTotal = document.getElementById('order-total');
    const orderForm = document.getElementById('orderForm');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancelOrder');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    renderCart();
    
    function renderCart() {
        // Очищаем контейнеры
        cartItemsContainer.innerHTML = '';
        cartSummaryContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <p>Ваша корзина пуста</p>
                    <div class="category-buttons" style="justify-content: center;">
                        <a href="santexnika.html" class="continue-shopping">Сантехника</a>
                        <a href="Electrika.html" class="continue-shopping">Электрика</a>
                        <a href="Instrument.html" class="continue-shopping">Инструменты</a>
                    </div>
                </div>
            `;
            return;
        }
        
        let subtotal = 0;
        
        // Рендерим каждый товар в корзине
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${item.price.toFixed(2)} BYN</div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                        <button class="remove-btn" data-index="${index}">Удалить</button>
                    </div>
                </div>
                <div class="item-total">${itemTotal.toFixed(2)} BYN</div>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Рендерим итоговую сумму
        cartSummaryContainer.innerHTML = `
            <div class="summary-row">
                <span>Промежуточный итог:</span>
                <span>${subtotal.toFixed(2)} BYN</span>
            </div>
            <div class="summary-row">
                <span>Доставка:</span>
                <span>Бесплатно</span>
            </div>
            <div class="summary-row total">
                <span>Итого:</span>
                <span>${subtotal.toFixed(2)} BYN</span>
            </div>
            <button class="checkout-btn" id="checkoutBtn">Оформить заказ</button>
        `;
        
        // Добавляем обработчики событий для кнопок
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
        });
        // Обработка отправки формы
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Очищаем корзину
        cart = [];
        updateCart();
        
        // Скрываем модальное окно
        hideOrderModal();
        
        // Показываем сообщение об успешном оформлении
        alert('Заказ отправлен!');
        
        // Очищаем форму
        orderForm.reset();
    });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity += 1;
                updateCart();
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
        
        document.getElementById('checkoutBtn')?.addEventListener('click', function() {
            showOrderModal();
        });
    }
    
    function showOrderModal() {
        // Заполняем список товаров в модальном окне
        let itemsHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            itemsHTML += `<div class="order-item">${item.name} - ${item.quantity} x ${item.price.toFixed(2)} BYN = ${itemTotal.toFixed(2)} BYN</div>`;
        });
        
        orderItemsList.innerHTML = itemsHTML;
        orderTotal.innerHTML = `Итого: ${total.toFixed(2)} BYN`;
        
        // Показываем модальное окно
        orderModal.style.display = 'block';
    }
    
    function hideOrderModal() {
        orderModal.style.display = 'none';
    }
    
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        // Обновляем счетчик на всех страницах
        if (window.opener) {
            window.opener.postMessage({type: 'updateCart'}, '*');
        }
    }
    
    // Обработчики для модального окна
    closeBtn.addEventListener('click', hideOrderModal);
    cancelBtn.addEventListener('click', hideOrderModal);
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            hideOrderModal();
        }
    });
    
    // Обработка отправки формы
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Собираем данные формы
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            comments: document.getElementById('comments').value,
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity
            })),
            total: orderTotal.textContent
        };
        
        // Отправляем данные на почту (используем Formspree или другой сервис)
        sendOrderEmail(formData);
        
        // Очищаем корзину
        cart = [];
        updateCart();
        
        // Скрываем модальное окно
        hideOrderModal();
        
        // Показываем сообщение об успешном оформлении
        alert('Ваш заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');
        
        // Очищаем форму
        orderForm.reset();
    });
    
    document.addEventListener('DOMContentLoaded', function() {
    // Все предыдущие функции остаются без изменений до функции sendOrderEmail
    
    function sendOrderEmail(formData) {
        // URL вашего Google Apps Script веб-приложения
        const scriptUrl = 'ВАШ_GOOGLE_APPS_SCRIPT_URL';
        
        // Формируем тело письма в HTML формате
        let emailBody = `
            <h2>Новый заказ!</h2>
            <p><strong>Имя:</strong> ${formData.firstName} ${formData.lastName}</p>
            <p><strong>Телефон:</strong> ${formData.phone}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Адрес:</strong> ${formData.address}</p>
            <p><strong>Комментарий:</strong> ${formData.comments || 'нет'}</p>
            <h3>Товары:</h3>
            <ul>
        `;
        
        formData.items.forEach(item => {
            emailBody += `
                <li>${item.name} - ${item.quantity} x ${item.price.toFixed(2)} BYN = ${item.total.toFixed(2)} BYN</li>
            `;
        });
        
        emailBody += `
            </ul>
            <h3>${formData.total}</h3>
        `;
        
        // Отправляем данные на Google Apps Script
        fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: "masinovskaadiana@gmail.com",
                subject: `Новый заказ от ${formData.firstName} ${formData.lastName}`,
                body: emailBody,
                formData: formData
            }),
        })
        .then(() => {
            console.log('Заказ отправлен');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    // Слушаем сообщения от других вкладок
    window.addEventListener('message', function(event) {
        if (event.data.type === 'updateCart') {
            cart = JSON.parse(localStorage.getItem('cart')) || [];
            renderCart();
        }
    });
});})