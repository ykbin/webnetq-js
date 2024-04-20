import documentReady from './DocumentReady.mjs';
import getElementByClassName from './GetElementByClassName.mjs';
import escapeHTML from './EscapeHTML.mjs';

const isExistsDocument = () => (typeof document === 'object' && document !== null);

let templateElement = null;
if (isExistsDocument) {
  templateElement = document.createElement('template');
}

const createElement = (html) => {
  if (!templateElement || typeof html !== "string")
    return null;
  templateElement.innerHTML = html;
  return templateElement.content.firstElementChild;
};

const setTextContent = (val, text) => {
  const element = (typeof val === "string") ? (isExistsDocument ? document.getElementById(val) : null) : val;
  if (element) {
    element.textContent = text;
  }
};

export default {
  documentReady,
  createElement,
  getElementByClassName,
  escapeHTML,
  setTextContent,
};
