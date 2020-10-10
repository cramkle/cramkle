// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  type Theme = 'dark' | 'light'

  interface Window {
    __theme: Theme
    __onThemeChange: () => void
    __setPreferredTheme: (theme: Theme) => void
  }
}

const darkThemeToggleScript = `
 (function() {
  window.__onThemeChange = function() {};
  function setTheme(newTheme) {
    window.__theme = newTheme;
    preferredTheme = newTheme;
    document.documentElement.classList.remove('__' + (newTheme === 'dark' ? 'light': 'dark') + '-mode');
    document.documentElement.classList.add('__' + newTheme + '-mode');
    window.__onThemeChange(newTheme);
  }
  var preferredTheme;
  try {
    preferredTheme = localStorage.getItem('theme');
  } catch (err) { }
  window.__setPreferredTheme = function(newTheme) {
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (err) {}
  }
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkQuery.addListener(function(e) {
    window.__setPreferredTheme(e.matches ? 'dark' : 'light')
  });
  setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'));
})();
`.trim()

export const darkThemeHelmetScript = {
  innerHTML: darkThemeToggleScript,
}
