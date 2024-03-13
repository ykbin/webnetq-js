const chunkSize = 4096;

function handelNotify(type, event) {
  if (this._listeners.hasOwnProperty(type)) {
    this._listeners[type].forEach(callback => { callback(event) });
  }
}

function onLoadChunk(offset, size, buffer) {
  const testOffset = Math.floor(offset / chunkSize) * chunkSize;
  if (buffer.byteLength != size || offset != testOffset)
    handelNotify.call(this, "error", {message: "Cannot read file to memory"});
  let backward;
  let currChunk = null;
  let preferChunk = null;
  if (this._firstChunk == null) {
    currChunk = {
      next: null,
      prev: null,
      start: offset,
      end: offset + size,
    };
    backward = true;
    this._firstChunk = currChunk;
  }
  else {
    for (let iter = this._firstChunk; iter != null; iter = iter.next) {
      if (currChunk === null) {
        if (offset == iter.end) {
          iter.end = offset + size;
          const nextChunk = iter.next;
          if (nextChunk && nextChunk.start == iter.end) {
            iter.end = nextChunk.end;
            iter.next = nextChunk.next;
            if (nextChunk.next) {
              nextChunk.next.prev = iter;
            }
          }
          currChunk = iter;
          backward = true;
        }
        else if (offset == (iter.start - chunkSize)) {
          iter.start = offset;
          const prevChunk = iter.prev;
          if (prevChunk && prevChunk.end == iter.start) {
            iter.start = prevChunk.start;
            iter.prev = prevChunk.prev;
            if (prevChunk.prev) {
              prevChunk.prev.next = iter;
            }
          }
          currChunk = iter;
          backward = false;
        }
        else if (offset < (iter.start - chunkSize)) {
          currChunk = {
            next: iter,
            prev: iter.prev,
            start: offset,
            end: offset + size,
          };
          if (currChunk.prev) {
            currChunk.prev.next = currChunk;
          }
          iter.prev = currChunk;
          backward = true;
        }
        else if (!iter.next) {
          if (offset <= iter.end)
            handelNotify.call(this, "error", {message: "Cannot read file to memory"});
          currChunk = {
            next: null,
            prev: iter,
            start: offset,
            end: offset + size,
          };
          iter.next = currChunk;
          backward = true;
        }
      }
      if (this._preferOffset !== null) {
        if (iter.start <= this._preferOffset && this._preferOffset <= iter.end) {
          preferChunk = iter;
          this._preferOffset = null;
        }
      }
    }
  }

  handelNotify.call(this, "chunk", { offset: offset, size: size, buffer: buffer });
  this._totalSize += size;

  loadChunk.call(this, preferChunk || currChunk, backward);
}

function loadChunk(currChunk, backward) {
  const fileSize = this._file.size;
  if (this._totalSize < fileSize) {
    let offset;
    if (this._preferOffset !== null) {
      offset = this._preferOffset;
      this._preferOffset = null;
    }
    else if ((backward && currChunk.start != 0) || currChunk.end >= fileSize) {
      offset = currChunk.start - chunkSize;
    }
    else {
      offset = currChunk.end;
    }
    const length = (offset + chunkSize > fileSize) ? fileSize - offset : chunkSize;
    // console.log(`read - offset: ${offset} length: ${length}`);
    const chunk = this._file.slice(offset, offset + length);
    chunk.arrayBuffer().then(buffer => {
      !this._stop && onLoadChunk.call(this, offset, length, buffer);
    });
  }
  else {
    if (!this._firstChunk || this._firstChunk.next || this._firstChunk.prev)
      handelNotify.call(this, "error", {message: "Cannot read file to memory"});
    handelNotify.call(this, "done", {});
  }
}

export default class {
  _file;
  _numberOfChunks;
  _firstChunk = null;
  _totalSize = 0;
  _listeners = {};
  _start = false;
  _stop = false;
  _preferOffset = 0;

  constructor(file) {
    this._file = file;
    this._numberOfChunks = Math.floor(file.size / chunkSize);
  }

  isLoad() {
    return this._totalSize >= this._file.size;
  }
  
  start() {
    if (!this._start) {
      this._start = true;
      setTimeout(() => {
        loadChunk.call(this, null, false)
      }, 0);
    }
  };
  
  stop() {
    this._stop = true;
    let iter = this._firstChunk;
    while (iter != null) {
      const temp = iter;
      iter = iter.next;
      temp.next = null;
      temp.prev = null;
    }
    this._firstChunk = null;
  };
  
  setPreferOffset(value) {
    this._preferOffset = Math.floor(value / chunkSize) * chunkSize;
    // console.log(`setPreferOffset - value: ${value} out: ${this._preferOffset}`)
  }

  addEventListener(type, listener) {
    if (!this._listeners.hasOwnProperty(type)) {
      this._listeners[type] = [];
    }
    this._listeners[type].push(listener);
  }
};
