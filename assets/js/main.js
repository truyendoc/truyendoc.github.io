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

    // Run Init
    init();
});
