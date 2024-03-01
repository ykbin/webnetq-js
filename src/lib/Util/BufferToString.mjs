export function bufferToString(buffer) {
  if (typeof(TextEncoder) != 'undefined') {
    var enc = new TextDecoder("utf-8");
    return enc.decode(buffer);
  }
  else {
    let text = '';
    let bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; ++i) {
      const b = bytes[i];
      const s = b.toString(16);
      text += (b < 16 ? '%0' : '%') + s;
    }
    return decodeURIComponent(text);
  }
};
