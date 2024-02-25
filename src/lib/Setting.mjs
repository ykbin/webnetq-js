
const THEME_KEY = 'theme';

const THEME = {
  LIGHT: 'light',
  DARK:  'dark',
};

let _instance = null;

export default class Setting {
  _colorScheme;
  _prefersColorScheme = null;
  _listeners = {
    themchange: [],
  };

  constructor() {
    let colorScheme = localStorage ? localStorage.getItem(THEME_KEY) : null;
    if (window && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      this._prefersColorScheme = mediaQuery.matches ? THEME.DARK : THEME.LIGHT;
      mediaQuery.addEventListener('change', event => this.onPrefersColorSchemeChange(event));
    }
    if (colorScheme != THEME.LIGHT && colorScheme != THEME.DARK) {
      colorScheme = this._prefersColorScheme || THEME.LIGHT;
    }
    this.setColorScheme(colorScheme);
  }

  getTheme() {
    return this._colorScheme;
  }

  setTheme(value) {
    if (value == THEME.LIGHT || value == THEME.DARK) {
      if (localStorage) {
        if (this._prefersColorScheme != value)
          localStorage.setItem(THEME_KEY, value);
        else
          localStorage.removeItem(THEME_KEY);
      }
      this.setColorScheme(value);
    }
    else {
      localStorage && localStorage.removeItem(THEME_KEY);
      this.setColorScheme(this._prefersColorScheme || THEME.LIGHT);
    }
  }

  toggleTheme() {
    this.setTheme((this._colorScheme != THEME.LIGHT) ? THEME.LIGHT : THEME.DARK);
  }

  setColorScheme(colorScheme) {
    if (this._colorScheme != colorScheme) {
      this._colorScheme = colorScheme;
      this._dispatchEvent('themchange', { theme: colorScheme });
    }
  }

  onPrefersColorSchemeChange(event) {
    this._prefersColorScheme = event.matches ? THEME.DARK : THEME.LIGHT;
    localStorage && localStorage.removeItem(THEME_KEY);
    this.setColorScheme(this._prefersColorScheme);
  }

  _dispatchEvent(type, event) {
    this._listeners[type].forEach(listener => listener(event));
  }

  addEventListener(type, listener) {
    this._listeners[type].push(listener);
  }

  static getInstance() {
    if (!_instance)
      _instance = new Setting;
    return _instance;
  }
};
