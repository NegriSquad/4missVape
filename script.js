// Мобильное меню
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    burger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if(this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Анимация при скролле
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Наблюдаем за элементами
document.querySelectorAll('.feature-card, .device-item').forEach(el => {
    observer.observe(el);
});

// Функция для подсчета загрузок (имитация)
function trackDownload(filename) {
    // В реальном проекте здесь был бы AJAX запрос к серверу
    console.log(`Загрузка файла: ${filename}`);
    
    // Сохраняем в localStorage для демонстрации
    let downloads = JSON.parse(localStorage.getItem('4missVape_downloads') || '{}');
    downloads[filename] = (downloads[filename] || 0) + 1;
    localStorage.setItem('4missVape_downloads', JSON.stringify(downloads));
    
    // Показываем уведомление
    showDownloadNotification(filename);
}

// Показ уведомления о скачивании
function showDownloadNotification(filename) {
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <i class="fas fa-download"></i>
        <span>Скачивание ${filename} началось</span>
        <i class="fas fa-times close-notification"></i>
    `;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Закрытие уведомления
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Добавляем анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .close-notification {
        cursor: pointer;
        margin-left: 10px;
        opacity: 0.8;
        transition: opacity 0.3s;
    }
    
    .close-notification:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);