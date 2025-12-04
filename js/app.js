document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navigation a');
    const contentArea = document.getElementById('content-area');

    const loadContent = async (hash) => {
        // Разбираем хэш. Пример: #tavern:error-503
        // pagePart = 'tavern', anchorPart = 'error-503'
        let cleanHash = hash.replace('#', '');
        let [pagePart, anchorPart] = cleanHash.split(':');

        // Если хэш пустой, грузим intro
        if (!pagePart) {
            pagePart = 'intro';
        }

        try {
            const response = await fetch(`content/${pagePart}.html`);
            if (!response.ok) {
                throw new Error(`Не удалось загрузить файл: content/${pagePart}.html`);
            }
            const text = await response.text();
            contentArea.innerHTML = text;

            // Если есть якорная ссылка (часть после :), скроллим к ней
            if (anchorPart) {
                const element = document.getElementById(anchorPart);
                if (element) {
                    // Небольшая задержка, чтобы браузер успел отрисовать картинки/структуру
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Добавляем эффект подсветки для наглядности
                        element.style.animation = "highlight 2s";
                    }, 100);
                }
            } else {
                // Если якоря нет, скроллим вверх
                window.scrollTo(0, 0);
            }

        } catch (error) {
            console.error('Ошибка загрузки контента:', error);
            contentArea.innerHTML = `<p>Не удалось загрузить раздел. Пожалуйста, попробуйте еще раз или проверьте соединение.</p>`;
        }
    };

    // Обработчик кликов меню (обновляет URL, запуская hashchange)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Стандартное поведение ссылок оставляем, чтобы менялся хэш
            // Но если есть data-content, используем его для формирования хэша
            const contentId = link.getAttribute('data-content');
            if (contentId) {
                // Это ссылки из бокового меню
                // Они просто меняют хэш, а hashchange сделает остальное
            }
        });
    });

    // Функция для отслеживания изменений в адресной строке
    const handleHashChange = () => {
        loadContent(window.location.hash);
    };

    // Слушаем изменения хэша (это работает и для меню, и для ссылок внутри текста)
    window.addEventListener('hashchange', handleHashChange);

    // Загружаем начальный контент
    handleHashChange();
});

// Добавляем стиль подсветки в head динамически (опционально)
const style = document.createElement('style');
style.innerHTML = `
    @keyframes highlight {
        0% { background-color: rgba(255, 255, 0, 0.5); }
        100% { background-color: transparent; }
    }
`;
document.head.appendChild(style);

