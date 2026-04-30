document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navigation a');
    const contentArea = document.getElementById('content-area');

    const loadContent = async (hash) => {
        let cleanHash = hash.replace('#', '');
        let [pagePart, anchorPart] = cleanHash.split(':');

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

            if (anchorPart) {
                const element = document.getElementById(anchorPart);
                if (element) {
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        element.style.animation = "highlight 2s";
                    }, 100);
                }
            } else {
                window.scrollTo(0, 0);
            }

        } catch (error) {
            console.error('Ошибка загрузки контента:', error);
            contentArea.innerHTML = `<p>Не удалось загрузить раздел. Пожалуйста, попробуйте еще раз или проверьте соединение.</p>`;
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const contentId = link.getAttribute('data-content');
        });
    });

    const handleHashChange = () => {
        loadContent(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    // --- ЛОГИКА КОПИРОВАНИЯ (ИНТЕГРИРОВАНА БЕЗОПАСНО) ---
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.copyable')) {
            const element = e.target.closest('.copyable');
            const textToCopy = element.getAttribute('data-copy') || element.innerText.trim();

            try {
                await navigator.clipboard.writeText(textToCopy);

                const originalText = element.innerHTML;
                element.innerHTML = "✅ Скопировано!";
                element.classList.add('copied');

                setTimeout(() => {
                    element.innerHTML = originalText;
                    element.classList.remove('copied');
                }, 1500);

            } catch (err) {
                console.error('Ошибка копирования: ', err);
            }
        }
    });
    // --- КОНЕЦ ЛОГИКИ КОПИРОВАНИЯ ---

});

const style = document.createElement('style');
style.innerHTML = `
    @keyframes highlight {
        0% { background-color: rgba(255, 255, 0, 0.5); }
        100% { background-color: transparent; }
    }
`;
document.head.appendChild(style);
