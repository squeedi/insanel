document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const closeBtn = document.getElementById('closeMenuBtn');
    const verticalMenu = document.getElementById('verticalMenu');
    
    // Открытие меню
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        verticalMenu.style.display = 'block'; // Добавляем это
        setTimeout(() => { // Небольшая задержка для плавности
            verticalMenu.classList.add('active');
        }, 10);
    });
    
    // Закрытие меню
    closeBtn.addEventListener('click', function() {
        verticalMenu.classList.remove('active');
        setTimeout(() => {
            verticalMenu.style.display = 'none'; // Скрываем после анимации
        }, 300); // Должно совпадать с длительностью transition
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', function(e) {
        if (!verticalMenu.contains(e.target) && e.target !== menuBtn) {
            verticalMenu.classList.remove('active');
            setTimeout(() => {
                verticalMenu.style.display = 'none';
            }, 300);
        }
    });
    
    // Закрытие меню при нажатии на ссылку в меню
    const menuLinks = verticalMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            verticalMenu.classList.remove('active');
            setTimeout(() => {
                verticalMenu.style.display = 'none';
            }, 300);
        });
    });
    
    // Адаптация при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            verticalMenu.classList.remove('active');
            setTimeout(() => {
                verticalMenu.style.display = 'none';
            }, 300);
        }
    });
    
    // Анимация появления элементов при скролле
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.section, .contact');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});