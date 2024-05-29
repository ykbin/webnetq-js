const LIGHT_VAL = 'light';
const DARK_VAL = 'dark';
const DATA_KEY = 'theme';

let _instance = null;

export default class Setting {
  _colorScheme;
  _prefersColorScheme = null;
  _listeners = {
    themchange: [],
  };

  constructor() {
    let colorScheme = localStorage ? localStorage.getItem(DATA_KEY) : null;
    if (window && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      this._prefersColorScheme = mediaQuery.matches ? DARK_VAL : LIGHT_VAL;
      mediaQuery.addEventListener('change', event => this.onPrefersColorSchemeChange(event));
    }
    if (colorScheme != LIGHT_VAL && colorScheme != DARK_VAL) {
      colorScheme = this._prefersColorScheme || LIGHT_VAL;
    }
    this.setColorScheme(colorScheme);
  }

  getTheme() {
    return this._colorScheme;
  }

  setTheme(value) {
    if (value == LIGHT_VAL || value == DARK_VAL) {
      if (localStorage) {
        if (this._prefersColorScheme != value)
          localStorage.setItem(DATA_KEY, value);
        else
          localStorage.removeItem(DATA_KEY);
      }
      this.setColorScheme(value);
    }
    else {
      localStorage && localStorage.removeItem(DATA_KEY);
      this.setColorScheme(this._prefersColorScheme || LIGHT_VAL);
    }
  }

  toggleTheme() {
    this.setTheme((this._colorScheme != LIGHT_VAL) ? LIGHT_VAL : DARK_VAL);
  }

  setColorScheme(colorScheme) {
    if (this._colorScheme != colorScheme) {
      this._colorScheme = colorScheme;
      this._dispatchEvent('themchange', { theme: colorScheme });
    }
  }

  onPrefersColorSchemeChange(event) {
    this._prefersColorScheme = event.matches ? DARK_VAL : LIGHT_VAL;
    localStorage && localStorage.removeItem(DATA_KEY);
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

Setting.LIGHT_VAL = LIGHT_VAL;
Setting.DARK_VAL = DARK_VAL;
Setting.DARK_VAL = DARK_VAL;
