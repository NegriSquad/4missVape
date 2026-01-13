// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // Плавная прокрутка для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами с анимацией
    document.querySelectorAll('.feature-card, .download-card, .step, .component-item').forEach(el => {
        observer.observe(el);
    });
    
    // Подсветка активного раздела в навигации при скролле
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
    
    // Анимация для кнопок скачивания
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href').includes('download')) {
                e.preventDefault();
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Скачивание...';
                this.classList.add('downloading');
                
                // Симуляция загрузки
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.classList.remove('downloading');
                    this.classList.add('downloaded');
                    
                    // Реальная загрузка файла
                    const link = document.createElement('a');
                    link.href = this.getAttribute('href');
                    link.download = '';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    setTimeout(() => {
                        this.classList.remove('downloaded');
                    }, 2000);
                }, 1500);
            }
        });
    });
    
    // Интерактивная схема подключения
    const pins = document.querySelectorAll('.pin');
    pins.forEach(pin => {
        pin.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'pin-tooltip';
            tooltip.textContent = this.getAttribute('data-pin');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - 30) + 'px';
        });
        
        pin.addEventListener('mouseleave', function() {
            const tooltips = document.querySelectorAll('.pin-tooltip');
            tooltips.forEach(tooltip => tooltip.remove());
        });
    });
    
    // Темная/светлая тема
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.querySelector('.navbar .container').appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggle.innerHTML = document.body.classList.contains('dark-theme') 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        
        // Сохраняем выбор в localStorage
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
    
    // Восстанавливаем тему при загрузке
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Анимация счетчиков на странице "О проекте"
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0 && window.location.pathname.includes('about.html')) {
        const animateValue = (element, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (end - start) + start);
                element.textContent = value.toLocaleString();
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const targetValue = parseInt(stat.textContent.replace(/,/g, ''));
                    animateValue(stat, 0, targetValue, 2000);
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => observer.observe(stat));
    }
    
    // Модальное окно для предупреждений
    document.querySelectorAll('.warning').forEach(warning => {
        warning.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3><i class="fas fa-exclamation-triangle"></i> Важное предупреждение</h3>
                    <p>Прошивка Bruce предназначена для опытных пользователей. 
                    Неправильное использование может привести к повреждению оборудования. 
                    Все действия вы выполняете на свой страх и риск.</p>
                    <button class="btn btn-primary close-modal">Понятно</button>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    });
});

// Добавляем стили для модального окна
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }
    
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    
    .modal h3 {
        color: var(--warning-color);
        margin-bottom: 1rem;
    }
    
    .close-modal {
        margin-top: 1rem;
    }
    
    .pin-tooltip {
        position: fixed;
        background: var(--dark-color);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.9rem;
        z-index: 1000;
        pointer-events: none;
    }
    
    .theme-toggle {
        background: rgba(255,255,255,0.1);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 1rem;
    }
    
    .dark-theme {
        background: #1a1a1a;
        color: #f0f0f0;
    }
    
    .dark-theme .feature-card,
    .dark-theme .download-card,
    .dark-theme .component-item,
    .dark-theme .team-member,
    .dark-theme .faq-item,
    .dark-theme .roadmap-item,
    .dark-theme .contact-method,
    .dark-theme .step-content,
    .dark-theme .pinout-table,
    .dark-theme .circuit-diagram,
    .dark-theme .modal-content {
        background: #2d2d2d;
        color: #f0f0f0;
    }
    
    .downloading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .downloaded {
        background: var(--success-color) !important;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animated {
        animation: fadeInUp 0.6s ease-out;
    }
`;

document.head.appendChild(modalStyles);