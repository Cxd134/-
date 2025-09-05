// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // 导航栏功能
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    
    // 移动端菜单切换
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // 汉堡菜单动画
            const bars = document.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });
    }
    
    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // 平滑滚动导航
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 减去导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const bars = document.querySelectorAll('.bar');
                    bars.forEach(bar => {
                        bar.style.transform = 'none';
                        bar.style.opacity = '1';
                    });
                }
            }
        });
    });
    
    // 作品筛选功能
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选作品
            workItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, 100);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('animate');
                }
            });
        });
    });
    
    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.work-item, .media-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // 视差滚动效果
    const floatingElements = document.querySelectorAll('.floating-element');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        floatingElements.forEach(element => {
            const speed = element.getAttribute('data-speed');
            const yPos = -(scrolled * speed * 0.5);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // 联系表单处理
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // 简单的表单验证
            if (!name || !email || !subject || !message) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('请输入有效的邮箱地址', 'error');
                return;
            }
            
            // 模拟表单提交
            showNotification('消息发送成功！我们会尽快回复您。', 'success');
            this.reset();
        });
    }
    
    // 邮箱验证函数
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // 通知函数
    function showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 关闭按钮事件
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
        
        // 自动隐藏
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
    }
    
    function hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // 数字计数动画
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalNumber = stat.textContent;
            const isK = finalNumber.includes('K');
            const number = parseInt(finalNumber.replace('K', ''));
            
            let currentNumber = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= number) {
                    currentNumber = number;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(currentNumber) + (isK ? 'K' : '');
            }, 30);
        });
    }
    
    // 当自媒体区域进入视口时启动数字动画
    const mediaSection = document.querySelector('.media');
    if (mediaSection) {
        const mediaObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    mediaObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        mediaObserver.observe(mediaSection);
    }
    
    // 触摸滑动支持（移动端）
    let touchStartX = 0;
    let touchEndX = 0;
    
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 向左滑动
                console.log('向左滑动');
            } else {
                // 向右滑动
                console.log('向右滑动');
            }
        }
    }
    
    // 为作品展示区添加触摸事件
    const worksSection = document.querySelector('.works');
    if (worksSection && 'ontouchstart' in window) {
        worksSection.addEventListener('touchstart', handleTouchStart, false);
        worksSection.addEventListener('touchend', handleTouchEnd, false);
    }
    
    // 性能优化：节流滚动事件
    let ticking = false;
    
    function updateOnScroll() {
        // 更新视差效果
        const scrolled = window.pageYOffset;
        
        floatingElements.forEach(element => {
            const speed = element.getAttribute('data-speed');
            const yPos = -(scrolled * speed * 0.5);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    // 使用节流的滚动事件
    window.addEventListener('scroll', requestTick);
    
    // 页面加载完成后的初始化
    window.addEventListener('load', function() {
        // 添加页面加载完成的类
        document.body.classList.add('loaded');
        
        // 初始化作品展示
        workItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
            }, index * 100);
        });
    });
    
    // 键盘导航支持
    document.addEventListener('keydown', function(e) {
        // ESC键关闭移动端菜单
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const bars = document.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
        
        // 方向键导航
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            const currentSection = getCurrentSection();
            const nextSection = getNextSection(currentSection);
            if (nextSection) {
                smoothScrollTo(nextSection);
            }
        }
        
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            const currentSection = getCurrentSection();
            const prevSection = getPrevSection(currentSection);
            if (prevSection) {
                smoothScrollTo(prevSection);
            }
        }
    });
    
    // 获取当前可见的区块
    function getCurrentSection() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        for (let section of sections) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                return section;
            }
        }
        return sections[0];
    }
    
    // 获取下一个区块
    function getNextSection(currentSection) {
        const sections = Array.from(document.querySelectorAll('section'));
        const currentIndex = sections.indexOf(currentSection);
        return sections[currentIndex + 1] || null;
    }
    
    // 获取上一个区块
    function getPrevSection(currentSection) {
        const sections = Array.from(document.querySelectorAll('section'));
        const currentIndex = sections.indexOf(currentSection);
        return sections[currentIndex - 1] || null;
    }
    
    // 平滑滚动到指定区块
    function smoothScrollTo(section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
    
    // 为作品图片添加加载占位、成功替换与失败保底（防止早期error丢失）
    const workImages = document.querySelectorAll('.works-grid img');

    function buildFallback(label) {
        const text = (label || '作品预览').slice(0, 16);
        const encoded = encodeURIComponent(text);
        const svg = `<?xml version='1.0' encoding='UTF-8'?>
<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='1200' viewBox='0 0 1600 1200'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#6366f1'/>
      <stop offset='100%' stop-color='#ec4899'/>
    </linearGradient>
  </defs>
  <rect width='1600' height='1200' fill='url(#g)' opacity='0.18'/>
  <g opacity='0.9'>
    <rect x='160' y='240' width='1280' height='720' rx='28' fill='white' opacity='0.85'/>
  </g>
  <text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' fill='#4b5563' font-family='Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif' font-size='64' font-weight='600'>${encoded}</text>
</svg>`;
        return 'data:image/svg+xml;utf8,' + svg;
    }

    workImages.forEach(img => {
        const desiredSrc = img.getAttribute('src');
        const altText = img.getAttribute('alt') || '作品预览';
        const placeholder = buildFallback(altText);

        // 立即显示占位，避免透明
        img.setAttribute('data-src', desiredSrc);
        if (img.src !== placeholder) {
            img.src = placeholder;
        }

        // 预加载真实图片
        const loader = new Image();
        loader.decoding = 'async';
        loader.onload = () => {
            img.src = desiredSrc;
            img.classList.add('loaded');
        };
        loader.onerror = () => {
            // 保留占位，也结束过渡
            img.classList.add('loaded');
        };
        loader.src = desiredSrc;

        // 若占位已渲染，确保不透明
        requestAnimationFrame(() => {
            if (!img.classList.contains('loaded')) {
                img.classList.add('loaded');
            }
        });
    });
    
    // 添加CSS样式到页面
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        
        .notification-close:hover {
            opacity: 0.8;
        }
        
        .loaded .hero-title .title-line,
        .loaded .hero-subtitle,
        .loaded .hero-buttons {
            animation-play-state: running;
        }
    `;
    document.head.appendChild(style);
    
});

