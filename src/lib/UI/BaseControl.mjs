import { NQDOM } from '../../index.mjs';

export default class BaseControl {
  _manager = null;
  _parent = null;
  _children = [];

  _element;
  _portElement;

  _defaultDisplay;

  constructor(element) {
    this._element = element;
    const portClass = this.constructor.template.portClass;
    this._portElement = NQDOM.getElementByClassName(element, portClass);
    this._defaultDisplay = this._element.style.display;
  }

  get element() {
    return this._element;
  }

  get dataset() {
    return this._element.dataset;
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

  appendControl(control, managerAppend) {
    if (control._parent) {
      console.warn(`Control '${this.constructor.template.name}' already has a parent`);
      return;
    }
    if (!this._portElement) {
      console.warn(`Port not exists for ${this.constructor.template.name}`);
      return;
    }
    if (!managerAppend) {
      this._portElement.appendChild(control.element);
      this._manager && control.setManager(this._manager);
    }
    control._parent = this;
    this._children.push(control);
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
};
