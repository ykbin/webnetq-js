import documentReady from './DocumentReady.mjs';
import getElementByClassName from './GetElementByClassName.mjs';
import escapeHTML from './EscapeHTML.mjs';
import { toHiccup, fromHiccup } from './Hiccup.mjs';

const isExistsDocument = (typeof document === 'object' && document !== null);

let templateElement;
if (isExistsDocument) {
  templateElement = document.createElement('template');
}

const createElement = (html, document) => {
  if (typeof html !== "string")
    return;

  if (document) {
    const templateElm = document.createElement("template");
    templateElm.innerHTML = html;
    return templateElm.content.firstElementChild;
  }
  else if (templateElement) {
    templateElement.innerHTML = html;
    return templateElement.content.firstElementChild;
  }

  return;
};

const setTextContent = (val, text) => {
  const element = (typeof val === "string") ? (isExistsDocument ? document.getElementById(val) : null) : val;
  if (element) {
    element.textContent = text;
  }
};

const documentDescription = () => {
  if (isExistsDocument) {
    const descElm = document.querySelector('meta[name="description"][content]');
    if (descElm)
      return descElm.getAttribute("content");
  }

  return "";
};

export default {
  documentReady,
  documentDescription,
  createElement,
  getElementByClassName,
  escapeHTML,
  setTextContent,
  toHiccup,
  fromHiccup,
};
