import { SleepAsync } from './SleepAsync.mjs';
import { isEqualArray } from './ArrayExtras.mjs';

export default {
  isEqualArray,
  Promises: {
    sleep: SleepAsync,
  },
};
