document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeBtn = document.getElementById('theme-toggle');
    const fontIncBtn = document.getElementById('font-inc');
    const fontDecBtn = document.getElementById('font-dec');
    const htmlElement = document.documentElement;

    // Config
    const THEMES = ['light', 'dark', 'sepia'];
    const BASE_FONT_SIZE = 18; // px
    const MIN_FONT_SIZE = 14;
    const MAX_FONT_SIZE = 26;

    // State
    let currentThemeIndex = 0;
    let currentFontSize = BASE_FONT_SIZE;

    // --- Initialization ---

    function init() {
        // Load Theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        currentThemeIndex = THEMES.indexOf(savedTheme);
        if (currentThemeIndex === -1) currentThemeIndex = 0;
        applyTheme(THEMES[currentThemeIndex]);

        // Load Font Size
        const savedSize = parseInt(localStorage.getItem('fontSize'));
        if (!isNaN(savedSize)) {
            currentFontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, savedSize));
            applyFontSize(currentFontSize);
        }
    }

    // --- Reading History ---

    function saveHistory() {
        const body = document.body;
        const storySlug = body.getAttribute('data-story-slug');
        const chapterNum = body.getAttribute('data-chapter-number');
        const chapterTitle = body.getAttribute('data-chapter-title');

        if (storySlug && chapterNum) {
            const history = JSON.parse(localStorage.getItem('reading_history') || '{}');
            history[storySlug] = {
                url: window.location.href,
                chapter: chapterNum,
                title: chapterTitle,
                time: new Date().getTime()
            };
            localStorage.setItem('reading_history', JSON.stringify(history));
            console.log(`Saved history for ${storySlug}: Chapter ${chapterNum}`);
        }
    }

    function loadHistory() {
        // Only run on index page or lib page (where .story-card exists)
        const storyCards = document.querySelectorAll('.story-card');
        if (storyCards.length === 0) return;

        const history = JSON.parse(localStorage.getItem('reading_history') || '{}');

        storyCards.forEach(card => {
            const slug = card.getAttribute('data-slug');
            if (slug && history[slug]) {
                const data = history[slug];
                // Check if card body exists
                const cardBody = card.querySelector('.story-card-body');
                if (cardBody) {
                    const continueLink = document.createElement('div');
                    continueLink.className = 'history-link';
                    continueLink.innerHTML = `<a href="${data.url}" style="display: block; margin-top: 10px; color: var(--hover-color); font-weight: 500;">
                        ➤ Tiếp tục: Chương ${data.chapter}
                    </a>`;

                    // Insert before meta or append
                    const meta = cardBody.querySelector('.story-card-meta');
                    if (meta) {
                        cardBody.insertBefore(continueLink, meta);
                    } else {
                        cardBody.appendChild(continueLink);
                    }
                }
            }
        });
    }

    /* Search Functionality */
    const searchInput = document.getElementById('search-input');

    // Check if we are on Homepage (filtering stories) or Chapter Page (filtering chapters)
    const storyCards = document.querySelectorAll('.story-card');
    const chapterItems = document.querySelectorAll('.chapter-item');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            // Filter Stories (Home Page)
            if (storyCards.length > 0) {
                storyCards.forEach(card => {
                    const title = card.querySelector('.story-card-title').textContent.toLowerCase();
                    if (title.includes(searchTerm)) {
                        card.style.display = '';
                        card.classList.remove('hidden');
                    } else {
                        card.style.display = 'none';
                        card.classList.add('hidden');
                    }
                });
            }

            // Filter Chapters (TOC Page)
            if (chapterItems.length > 0) {
                chapterItems.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    // Match number or title
                    if (text.includes(searchTerm)) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            }
        });
    }

    // --- Actions ---

    function toggleTheme() {
        currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
        const newTheme = THEMES[currentThemeIndex];
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);

        // Update Icon based on theme
        let icon = '🌞'; // default light
        if (theme === 'dark') icon = '🌙';
        if (theme === 'sepia') icon = '☕';

        if (themeBtn) themeBtn.textContent = icon;
    }

    function adjustFontSize(delta) {
        const newSize = currentFontSize + delta;
        if (newSize >= MIN_FONT_SIZE && newSize <= MAX_FONT_SIZE) {
            currentFontSize = newSize;
            applyFontSize(currentFontSize);
            localStorage.setItem('fontSize', currentFontSize);
        }
    }

    function applyFontSize(size) {
        htmlElement.style.setProperty('--base-font-size', `${size}px`);
    }

    // --- Event Listeners ---

    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    if (fontIncBtn) {
        fontIncBtn.addEventListener('click', () => adjustFontSize(1));
    }

    if (fontDecBtn) {
        fontDecBtn.addEventListener('click', () => adjustFontSize(-1));
    }

    // Save history if on a chapter page
    saveHistory();

    // Load history if on index page
    loadHistory();

    // Run Init
    init();
});
