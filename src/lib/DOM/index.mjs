import documentReady from './DocumentReady.mjs';
import getElementByClassName from './GetElementByClassName.mjs';
import escapeHTML from './EscapeHTML.mjs';

let templateElement = null;
if (typeof document === 'object' && document !== null) {
  templateElement = document.createElement('template');
}

const createElement = (html) => {
  if (!templateElement || typeof html !== "string")
    return null;
  templateElement.innerHTML = html;
  return templateElement.content.firstElementChild;
};

export default {
  documentReady,
  createElement,
  getElementByClassName,
  escapeHTML,
};
