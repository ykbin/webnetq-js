
function replaceFileExt(filename, ext)
{
  const index = filename.lastIndexOf('.');
  return ((index === -1) ? filename : filename.substring(0, index)) + ext;
}

export default {
  replaceFileExt,
};
