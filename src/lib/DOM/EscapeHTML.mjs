export default function(unsafe) {
  if (document) {
    const template = document.createElement('template');
    template.textContent = unsafe;
    return template.innerText;
  }
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
