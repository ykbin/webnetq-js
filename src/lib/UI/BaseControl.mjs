import { NQDOM } from '../../index.mjs';

export default class BaseControl {
  _manager = null;
  _parent = null;
  _children = [];

  _element;
  _portElement;

  _defaultDisplay;
  _listeners = {};

  constructor(element, template) {
    this._element = element;
    this._template = template;

    const portClass = template.portClass;
    this._portElement = NQDOM.getElementByClassName(element, portClass);
    this._defaultDisplay = this._element.style.display;
  }

  get element() {
    return this._element;
  }

  get dataset() {
    return this._element.dataset;
  }

  get template() {
    return this._template;
  }

  show() {
    this._element.style.display = this._defaultDisplay;
  }

  hide() {
    this._element.style.display = 'none';
  }

  getControl(param) {
    if (typeof param === 'function') {
      return this._children.find((i) => i.constructor === param);
    }
    if (typeof param === 'string') {
      return this._children.find((i) => i.template.name === param);
    }
    return undefined;
  }

  getControles(param) {
    if (typeof param === 'function') {
      return this._children.filter((i) => i.constructor === param);
    }
    if (typeof param === 'string') {
      return this._children.filter((i) => i.template.name === param);
    }
    return [];
  }

  setManager(manager) {
    if (manager) {
      if (this._manager) {
        console.warn(`The manager is already installed`);
        return;
      }
      manager.appendControl(this);
    }
    else {
      if (!this._manager) {
        console.warn(`The manager is already removed`);
        return;
      }
      this._manager.removeControl(this)
    }
    this._manager = manager;
    this._children.forEach(control => control.setManager(manager));
  }

  insertControl(position, control, attachControl) {
    if (control._parent) {
      console.warn(`Control '${this.template.name}' already has a parent`);
      return;
    }
    if (!this._portElement) {
      console.warn(`Port not exists for ${this.template.name}`);
      return;
    }
    const pos = Math.min(position, this._children.length);
    if (!attachControl) {
      if (pos == this._children.length)
        this._portElement.appendChild(control.element);
      else
        this._portElement.insertBefore(control.element, this._portElement.children[pos]);
      this._manager && control.setManager(this._manager);
    }
    control._parent = this;
    this._children.splice(pos, 0, control);
  }

  appendControl(control, attachControl) {
    this.insertControl(this._children.length, control, attachControl);
  }

  removeControl(control) {
    if (control._parent !== this) {
      console.warn(`It's not possible to delete child`);
      return;
    }
    control._parent = null;
    const index = this._children.indexOf(control);
    if (index === -1) {
      console.warn(`The logic of the Control is broken`);
      return;
    }
    this._portElement.removeChild(control.element);
    this._children.splice(index, 1);
    control.setManager(null);
  }

  replaceChildren() {
    this._children.forEach(control => {
      control._parent = null;
      this._portElement.removeChild(control.element);
      this._manager && control.setManager(null);
    });
    this._children = [];
  }

  remove() {
    this._parent && this._parent.removeControl(this);
  }

  registerEvent(...args) {
    for (const iter of args) {
      if (Array.isArray(iter)) {
        for (const type of iter) {
          if (!this._listeners.hasOwnProperty(type)) {
            this._listeners[type] = [];
          }
        }
      }
      else {
        if (!this._listeners.hasOwnProperty(iter)) {
          this._listeners[iter] = [];
        }
      }
    }
  }

  dispatchEvent(type, event) {
    this._listeners[type].forEach(listener => listener(event));
  }

  addEventListener(type, listener) {
    if (this._listeners[type])
      this._listeners[type].push(listener);
    else
      console.warn(`Event type '${type}' not registered`);
  }
};
