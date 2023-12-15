let _pending = [];

const isReadyState = (value) => {
  return value === "interactive" || value === "complete";
};

const onReadyStateChange = (event) => {
  if (isReadyState(event.target.readyState)) {
    document.removeEventListener("readystatechange", onReadyStateChange);
    for (const handler of _pending)
      handler(event);
    _pending = null;
  }
};

if (typeof document === 'object' && document !== null)
  document.addEventListener("readystatechange", onReadyStateChange);
else {
  console.error('The document-ready only runs in the browser');
  // _pending = null;
}

export default (callback) => {
  if (_pending === null)
    setTimeout(callback, 0);
  else
    _pending.push(callback);
};
