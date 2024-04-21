import sleepAsync from './SleepAsync.mjs';
import { isEqualArray } from './ArrayExtras.mjs';
import { bufferToString } from './BufferToString.mjs';

function getGlobalThis() {
  if (typeof globalThis !== 'undefined')
    return globalThis;
  if (typeof window !== 'undefined')
    return window;
  if (typeof self !== 'undefined')
    return self;
  if (typeof global !== 'undefined')
    return global;
  return this;
}

export default {
  isEqualArray,
  bufferToString,

  getGlobalThis,
  globalThis: getGlobalThis(),

  createObjectURL: (() => {
    if (typeof window != "undefined") {
      if (window.createObjectURL)
        return window.createObjectURL;
      else if (window.URL)
        return window.URL.createObjectURL.bind(window.URL);
      else if (window.webkitURL)
        return window.webkitURL.revokeObjectURL.bind(window.webkitURL);
    }
    return () => { };
  })(),

  revokeObjectURL: (() => {
    if (typeof window != "undefined") {
      if (window.revokeObjectURL)
        return window.revokeObjectURL;
      else if (window.URL)
        return window.URL.revokeObjectURL.bind(window.URL);
      else if (window.webkitURL)
        return window.webkitURL.revokeObjectURL.bind(window.webkitURL);
    }
    return () => { };
  })(),

  Promises: {
    sleep: sleepAsync,
  },
};
