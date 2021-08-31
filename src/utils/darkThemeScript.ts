export const darkThemeHelmetScript = (darkMode?: boolean) => {
  return `
 (function() {
  window.__onThemeChange = function() {};
  function setTheme(newTheme) {
    window.__theme = newTheme;
    preferredTheme = newTheme;
    document.documentElement.classList.remove('__' + (newTheme === 'dark' ? 'light': 'dark') + '-mode');
    document.documentElement.classList.add('__' + newTheme + '-mode');
    window.__onThemeChange(newTheme);
  }

  var preferredTheme = ${JSON.stringify(
    darkMode == null ? undefined : darkMode ? 'dark' : 'light'
  )};

  window.__setPreferredTheme = function(newTheme) {
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (err) {}
  }

  setTheme(preferredTheme || 'light');
})();
`.trim()
}
