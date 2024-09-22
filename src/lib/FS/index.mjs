
function replaceFileExt(filename, ext) {
  const index = filename.lastIndexOf('.');
  return ((index === -1) ? filename : filename.substring(0, index)) + ext;
}

function getExtension(filename) {
  const index = filename.lastIndexOf('.');
  return ((index === -1) ? "" : filename.substring(index));
}

function fileSizeToString(value) {
  let size = 1;
  let suffix = "B";
  const kSuffixMap = [ "KB", "MB", "GB" ];
  for (const i in kSuffixMap) {
    const sz = size * 1024;
    if (value < sz)
      break;
    size = sz;
    suffix = kSuffixMap[i];
  }
  return Math.floor(value / size) + " " + suffix;
};

export default {
  replaceFileExt,
  getExtension,
  fileSizeToString,
};
