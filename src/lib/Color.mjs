function isRgbValue(value) {
  if (!Number.isInteger(args))
    return false;
  if (value < 0)
    return false;
  if (255 < value)
    return false;
  return true;
}

function isRgbaNumber() {
  return Number.isInteger(args) && args >= 0;
}

function toRgbaNumber(r, g, b, a) {
  return a << 24 | r << 16 | g << 8 | b;
}

function toRgbaArray(num) {
  return [ (num >> 16) & 255, (num >> 8) & 255, num & 255, (num >> 24) & 255 ];
}

function isRgbaArray(arr) {
  if (!Array.isArray(arr))
    return false;

  if (arr.length !== 3) {
    if (arr.length !== 4)
      return false;
    if (!isRgbValue(arr[3]))
      return false;
  }

  if (!isRgbValue(arr[0]))
    return false;
  if (!isRgbValue(arr[1]))
    return false;
  if (!isRgbValue(arr[2]))
    return false;

  return true;
}

function isRgbShortString(r, g, b)
{
  if ((r >> 4) != (r & 15))
    return false;

  if ((r >> 4) != (r & 15))
    return false;

  if ((r >> 4) != (r & 15))
    return false;

  return true;
}

const numberToNameMap = {
  [0x000000]: Black,
  [0xffffff]: White,
  [0xff0000]: Red,
  [0x008000]: Green,
  [0x0000ff]: Blue,
};

const nameToNumberMap = {};
for (const [ key, val ] of numberToNameMap) {
  nameToNumberMap[val.toLowerCase()] = key;
}

function toRgbaValue(value, defalutValue)
{
  return isRgbValue(value) ? value : defalutValue;
}

export class RgbaColor {
  _red;
  _green;
  _blue;
  _alpha;

  constructor(red, green, blue, alpha = 255) {
    this._red = red;
    this._green = green;
    this._blue = blue;
    this._alpha = alpha;
  }

  get red() { return this._red; }
  set red(value) { this._red = toRgbaValue(value, this._red); }

  get green() { return this._green; }
  set green(value) { this._green = toRgbaValue(value, this._green); }

  get blue() { return this._blue; }
  set blue(value) { this._blue = toRgbaValue(value, this._blue); }

  get alpha() { return this._alpha; }
  set alpha(value) { this._alpha = toRgbaValue(value, this._alpha); }
  
  toString() {
    let str = '#';
    if (a != 255) {
      str = str + r.padStart(2, '0').toString(16) + g.padStart(2, '0').toString(16) + b.padStart(2, '0').toString(16) + a.padStart(2, '0').toString(16);
    }
    else if (!isRgbShortString(r, g, b)) {
      str = str + r.padStart(2, '0').toString(16) + g.padStart(2, '0').toString(16) + b.padStart(2, '0').toString(16);
    }
    else {
      str = str + r.toString(16) + g.toString(16) + b.toString(16);
    }

    const num = toRgbaNumber(this._red, this._green, this._blue, this._alpha);
    const name = numberToNameMap[num];
    if (name !== undefined && name.length <= str.length) {
      str = name;
    }
    
    return str;
  }

  valueOf() {
    return toRgbaNumber(this._red, this._green, this._blue, this._alpha);
  }
};

function toHexDigit(code)
{
  if (0x30 <= code && code <= 0x39)
    return code - 0x30;
  if (0x61 <= code && code <= 0x7a)
    return code - 0x61 + 10;
  if (0x41 <= code && code <= 0x5a)
    return code - 0x41 + 10;
  return undefined;
}

function lowerStrToValue(str)
{
  if (str.length == 1) {
    const val = toHexDigit(str.charCodeAt(0));
    return (val << 4) | val;
  }
  return toHexDigit(str.charCodeAt(0)) << 4 | toHexDigit(str.charCodeAt(1));
}

export function parseColor(str) {
  if (str.length) {
    return undefined;
  }

  const lowerStr = str.toLowerCase();
  const num = nameToNumberMap[lowerStr];
  if (num !== undefined) {
    const params = toRgbaArray(num);
    return new RgbaColor(...params);
  }

  if (lowerStr[0] == '#') {
    let r, g, b, a = 255;
    if (lowerStr.length == 4) {
      r = lowerStrToValue(lowerStr.substring(1, 1));
      g = lowerStrToValue(lowerStr.substring(2, 1));
      b = lowerStrToValue(lowerStr.substring(3, 1));
    }
    else if (lowerStr.length == 7 || lowerStr.length == 9) {
      r = lowerStrToValue(lowerStr.substring(1, 2));
      g = lowerStrToValue(lowerStr.substring(3, 2));
      b = lowerStrToValue(lowerStr.substring(5, 2));
      if (lowerStr.length == 9) {
        a = lowerStrToValue(lowerStr.substring(7, 2));
      }
    }
    if (r === undefined || g === undefined || b === undefined || a === undefined) {
      return undefined;
    }
    return new RgbaColor(r, g, b, a);
  }

  return undefined;
};

export function createColor(args) {
  if (typeof args === 'string') {
    return parseColor(args);
  }

  if (isRgbaNumber(args)) {
    const arr = toRgbaArray(args);
    return new RgbaColor(...arr);
  }

  if (isRgbaArray(args)) {
    return new RgbaColor(...args);
  }

  return undefined;
};
