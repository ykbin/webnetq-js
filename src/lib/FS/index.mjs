
function replaceFileExt(filename, ext) {
  const index = filename.lastIndexOf('.');
  return ((index === -1) ? filename : filename.substring(0, index)) + ext;
}

function getExtension(filename) {
  const index = filename.lastIndexOf('.');
  return ((index === -1) ? "" : filename.substring(index));
}

export default {
  replaceFileExt,
  getExtension,
};
