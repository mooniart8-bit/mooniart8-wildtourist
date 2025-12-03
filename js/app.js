document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navigation a');
    const contentArea = document.getElementById('content-area');

    const loadContent = async (contentId) => {
        try {
            // Устанавливаем стандартную страницу, если хэш пустой
            if (!contentId) {
                contentId = 'intro';
            }
            const response = await fetch(`content/${contentId}.html`);
            if (!response.ok) {
                throw new Error(`Не удалось загрузить файл: content/${contentId}.html`);
            }
            const text = await response.text();
            contentArea.innerHTML = text;
        } catch (error) {
            console.error('Ошибка загрузки контента:', error);
            contentArea.innerHTML = `<p>Не удалось загрузить раздел. Пожалуйста, попробуйте еще раз.</p>`;
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const contentId = link.getAttribute('data-content');
            window.location.hash = contentId; // Меняем хэш в URL
        });
    });

    // Функция для загрузки контента при изменении хэша
    const handleHashChange = () => {
        const contentId = window.location.hash.substring(1);
        loadContent(contentId);
    };

    // Слушаем изменения хэша
    window.addEventListener('hashchange', handleHashChange);

    // Загружаем начальный контент при первой загрузке страницы
    handleHashChange();
});

