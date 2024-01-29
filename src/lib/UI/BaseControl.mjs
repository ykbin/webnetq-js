import { NQDOM } from '../../index.mjs';

export default class BaseControl {
  _element;
  _portElement;
  _children;

  constructor(element) {
    this._element = element;
    const portClass = this.constructor.template.portClass;
    this._portElement = NQDOM.getElementByClassName(element, portClass);
    this._children = [];
  }

  get element() {
    return this._element;
  }

  getControl(param) {
    if (typeof param === 'function') {
      return this._children.find((i) => i.constructor === param);
    }
    if (typeof param === 'string') {
      return this._children.find((i) => i.constructor.template.name === param);
    }
    return undefined;
  }

  getControles(param) {
    if (typeof param === 'function') {
      return this._children.filter((i) => i.constructor === param);
    }
    if (typeof param === 'string') {
      return this._children.filter((i) => i.constructor.template.name === param);
    }
    return [];
  }

  appendControl(control, ignorePort) {
    if (!this._portElement) {
      console.warn(`Port not exists for ${this.constructor.template.name}`);
      return;
    }
    if (!ignorePort) {
      this._portElement.appendChild(control.element);
    }
    this._children.push(control);
  }

  release() {
    this._element.remove();
    this._element = null;
    this._children = null;
  }
};
