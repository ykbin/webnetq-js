import Util from './Util/index.mjs';
import FS from './FS/index.mjs';
import MIME from './MIME/index.mjs';

const kTarBlockLength = 512;
const kTarDoubleBlockLength = kTarBlockLength * 2;
const kTarFilenameOffset = 0;
const kTarFilenameLength = 100;
const kTarModeOffset = kTarFilenameOffset + kTarFilenameLength;
const kTarModeLength = 8;
const kTarUidOffset = kTarModeOffset + kTarModeLength;
const kTarUidLength = 8;
const kTarGidOffset = kTarUidOffset + kTarUidLength;
const kTarGidLength = 8;
const kTarSizeOffset = kTarGidOffset + kTarGidLength;
const kTarSizeLength = 12;
const kTarMtimeOffset = kTarSizeOffset + kTarSizeLength;
const kTarMtimeLength = 12;
const kTarChksumOffset = kTarMtimeOffset + kTarMtimeLength;
const kTarChksumLength = 8;
const kTarTypeflagLength = 1;
const kTarLinknameLength = 100;
const kTarMagicLength = 6;
const kTarVersionLength = 2;
const kTarUsernameLength = 32;
const kTarGroupnameLength = 32;
const kTarDevmajorLength = 8;
const kTarDevminorLength = 8;
const kTarPrefixLength = 155;

function strnlen(bytes, offset, length) {
  for (let i = 0; i < length; i++) {
    if (bytes[offset + i] == 0)
      return i;
  }
  return length;
}

function fieldToString(bytes, offset, length) {
  const size = strnlen(bytes, offset, length);
  const dec = new TextDecoder("utf-8");
  return dec.decode(bytes.subarray(offset, offset + size));
}

function fieldToUint32(bytes, offset, length) {
  const str = fieldToString(bytes, offset, length);
  if (str.length != 0) {
    const num = parseInt(str, 8);
    if (num >= 0)
      return num;
  }
  return -1;
}

function tarballHeaderToObject(bytes) {
  if (bytes[0] == 0)
    return null;

  let pos = 0;

  const filename = fieldToString(bytes, pos, kTarFilenameLength);
  pos += kTarFilenameLength;

  const mode = fieldToUint32(bytes, pos, kTarModeLength);
  pos += kTarModeLength;

  const uid = fieldToUint32(bytes, pos, kTarUidLength);
  pos += kTarUidLength;

  const gid = fieldToUint32(bytes, pos, kTarGidLength);
  pos += kTarGidLength;

  const size = fieldToUint32(bytes, pos, kTarSizeLength);
  pos += kTarSizeLength;

  const mtime = fieldToUint32(bytes, pos, kTarMtimeLength);
  pos += kTarMtimeLength;

  const chksum = fieldToUint32(bytes, pos, kTarChksumLength);
  pos += kTarChksumLength;

  const typeflag = bytes[pos];
  pos += kTarTypeflagLength;

  pos += kTarLinknameLength;
  pos += kTarMagicLength;
  pos += kTarVersionLength;

  const username = fieldToString(bytes, pos, kTarUsernameLength);
  pos += kTarUsernameLength;

  const groupname = fieldToString(bytes, pos, kTarGroupnameLength);
  pos += kTarGroupnameLength;

  pos += kTarDevmajorLength;
  pos += kTarDevminorLength;
  pos += kTarPrefixLength;

  return {
    filename,
    mode,
    uid,
    gid,
    size,
    mtime,
    chksum,
    typeflag,
    username,
    groupname,
  };
}

function tarballCalculateChecksum(bytes) {
  const beginChksum = kTarChksumOffset;
  const endChksum = kTarChksumOffset + kTarChksumLength;
  let chksum = 0;
  for (let i = 0; i < kTarBlockLength; i++) {
    const b = (beginChksum <= i && i < endChksum) ? 0x20 : bytes[i];
    chksum += b;
  }
  return chksum;
}

function tarballToFileList(buffer) {
  const files = [];

  let offset = 0;
  let len = buffer.byteLength;
  for (;;) {
    if (len < kTarDoubleBlockLength)
      return null;

    const bytes = new Uint8Array(buffer, offset, kTarBlockLength);
    const hdr = tarballHeaderToObject(bytes);
    if (!hdr)
      break;

    if (hdr.chksum != tarballCalculateChecksum(bytes))
      return null;

    offset += kTarBlockLength;
    len -= kTarBlockLength;

    const options = { lastModified: hdr.mtime * 1000 };
    const ext = FS.getExtension(hdr.filename);
    const mime = MIME.fromExtension(ext);
    mime && (options.type = mime);

    const data = new Uint8Array(buffer, offset, hdr.size);
    const file = new File([ data ], hdr.filename, options);
    files.push(file);
    const alignSize = Math.floor((hdr.size + kTarBlockLength - 1) / kTarBlockLength) * kTarBlockLength;

    offset += alignSize;
    len -= alignSize;
  }

  const bytes = new Uint8Array(buffer, offset);
  if (bytes.length < kTarDoubleBlockLength) {
    return null;
  }

  for (let i = 0; i < kTarDoubleBlockLength; i++) {
    if (bytes[i] != 0)
      return null;
  }

  return files;
}

export function fileRequest(url, options) {
  let request = new XMLHttpRequest();

  const formData = new FormData();

  let result = undefined;
  let multiple = false;

  let listeners = [];
  const emitHandler = (error, result) => {
    if (error) {
      if (typeof error === "string")
        error = { message: error };
      if (typeof error === "number")
        error = { message: "Code " + error };
    }
    listeners.forEach(listener => listener(error, result));
  };

  for (const name in options) {
    if (options.hasOwnProperty(name)) {
      switch (name) {
      case 'bytes':
        formData.append(name, options[name]);
        break;
      case 'params':
        formData.append(name, JSON.stringify(options[name]));
        break;
      case 'onUploadProgress':
        request.upload.addEventListener("progress", options[name]);
        break;
      case 'onDownloadProgress':
        request.addEventListener("progress", options[name]);
        break;
      case 'multiple':
        multiple = options[name];
        break;
      case 'async':
        result = !options[name] ? undefined : new Promise((resolve, reason) => {
          listeners.push((error, result) => error ? reason(error) : resolve(result));
        });
        break;
      case 'onHandler':
        listeners.push((error, result) => options.onHandler(error, result));
        break;
      default:
        formData.append(name, JSON.stringify(options[name]));
        break;
      }
    }
  }

  request.addEventListener('error', function(event) {
    emitHandler("Can't connected to server");
  });

  request.addEventListener('load', function(event) {
    if (this.status === 200) {
      const type = this.getResponseHeader('Content-Type');
      if (type === "application/json") {
        let json;
        let success = true;
        try {
          const str = Util.bufferToString(this.response);
          json = JSON.parse(str);
        }
        catch(e) {
          emitHandler(e.message);
          success = false
        }
        if (success) {
          if (json.hasOwnProperty('error')) {
            let error = { message: "Unknown behavior" };
            let suffix = "";
            if (json.error.hasOwnProperty('code')) {
              error.code = json.error.code;
              suffix = " (" + error.code + ")";
            }
            if (json.error.hasOwnProperty('message'))
              error.message = json.error.message + suffix;
            else if (suffix)
              error.message = "Problem code" + suffix;
            emitHandler(error);
          }
          else if (json.hasOwnProperty('result')) {
            emitHandler(null, json.result);
          }
          else {
            emitHandler(null, new Blob([this.response], { type: type }));
          }
        }
      }
      else if (multiple && type === "application/x-tar") {
        const files = tarballToFileList(this.response);
        if (files) {
          emitHandler(null, files);
        }
        else {
          emitHandler(null, new Blob([this.response], { type: type }));
        }
      }
      else {
        emitHandler(null, new Blob([this.response], { type: type }));
      }
    } else {
      emitHandler("Request status " + this.status);
    }
  });

  request.open("POST", url);
  request.responseType = 'arraybuffer';
  request.send(formData);

  return result;
};
