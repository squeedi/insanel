document.addEventListener('DOMContentLoaded', function() {
    // Инициализация корзины
    updateCartCounter();
    
    // Обработчики для вертикального меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const verticalMenu = document.getElementById('verticalMenu');
    const closeMenu = document.querySelector('.close-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        verticalMenu.style.display = 'block';
        setTimeout(() => {
            verticalMenu.classList.add('active');
        }, 10);
    });
    
    closeMenu.addEventListener('click', function() {
        verticalMenu.classList.remove('active');
        setTimeout(() => {
            verticalMenu.style.display = 'none';
        }, 300);
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.vertical-menu a').forEach(link => {
        link.addEventListener('click', function() {
            verticalMenu.classList.remove('active');
            setTimeout(() => {
                verticalMenu.style.display = 'none';
            }, 300);
        });
    });
    
    // Обработчики для всплывающих окон
    const infoButtons = document.querySelectorAll('.info-btn');
    let currentPopup = null;
    
    infoButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Закрываем предыдущее окно, если оно открыто
            if (currentPopup) {
                closePopup(currentPopup);
            }
            
            const popup = this.closest('.grid-item').querySelector('.popup');
            if (popup) {
                // Показываем popup
                popup.style.display = 'block';
                setTimeout(() => {
                    popup.classList.add('active');
                }, 10);
                
                // Сохраняем ссылку на текущее окно
                currentPopup = popup;
                
                // Закрытие при нажатии ESC
                document.addEventListener('keydown', function escHandler(e) {
                    if (e.key === 'Escape') {
                        closePopup(popup);
                        document.removeEventListener('keydown', escHandler);
                    }
                });
            }
        });
    });
    
    // Обработчики для кнопок закрытия
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', function() {
            const popup = this.closest('.popup');
            closePopup(popup);
        });
    });
    
    // Функция для плавного закрытия popup
    function closePopup(popup) {
        if (popup) {
            popup.classList.remove('active');
            setTimeout(() => {
                popup.style.display = 'none';
                currentPopup = null;
            }, 300);
        }
    }
    
    // Обработчики для кнопок "В корзину"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = {
                id: this.getAttribute('data-id'),
                category: this.getAttribute('data-category'),
                name: this.getAttribute('data-name'),
                price: parseFloat(this.getAttribute('data-price')),
                image: this.getAttribute('data-image'),
                quantity: 1
            };
            addToCart(product);
        });
    });
    
    // Функции для работы с корзиной
    function updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const counter = document.querySelector('.cart-count');
        if (counter) {
            counter.textContent = totalItems;
            counter.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }
    
    function showCartNotification() {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = 'Товар добавлен в корзину!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }
    
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        showCartNotification();
        
        // Оповещаем другие вкладки об обновлении
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('cart-updates');
            channel.postMessage({ type: 'cart-updated', cart: cart });
            channel.close();
        }
    }
    
    // Слушаем сообщения от других вкладок
    if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('cart-updates');
        channel.onmessage = (event) => { 
            if (event.data.type === 'cart-updated') { 
                localStorage.setItem('cart', JSON.stringify(event.data.cart));
                updateCartCounter();
            }
        };
        
        // Закрываем канал при разгрузке страницы
        window.addEventListener('beforeunload', () => {
            channel.close();
        });
    }
});
 // Анимация появления элементов при скролле
 document.addEventListener('DOMContentLoaded', function() {
    // Элементы для анимации
    const elementsToAnimate = [
        ...document.querySelectorAll('.section'),
        document.querySelector('.contact')
    ];
    
    // Функция проверки видимости элемента
    function isElementInViewport(el) {
        if (!el) return false;
        
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight * 0.8) &&
            rect.bottom >= (window.innerHeight * 0.2)
        );
    }
    
    // Функция обработки скролла
    function handleScroll() {
        elementsToAnimate.forEach(el => {
            if (el && !el.classList.contains('visible') && isElementInViewport(el)) {
                el.classList.add('visible');
                
                // Анимация для товаров внутри секции
                if (el.classList.contains('section')) {
                    const productItems = el.querySelectorAll('.product-item, .product-itemt');
                    productItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100);
                    });
                }
            }
        });
    }
    
    // Инициализация - показать видимые элементы при загрузке
    handleScroll();
    
    // Обработчик скролла
    window.addEventListener('scroll', handleScroll);
    
    // Показать шапку сразу
    const header = document.querySelector('.header');
    if (header) header.style.opacity = '1';
});