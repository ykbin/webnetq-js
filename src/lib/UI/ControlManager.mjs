import { NQDOM } from '../../index.mjs';

let s_instance = null;

export default class ControlManager {
  static getInstance() {
    if (!s_instance) {
      s_instance = new ControlManager;
    }
    return s_instance;
  }

  _components = [];
  _controls = [];
  _idToControlMap = new Map();
  _listeners = {
    load: [],
  };

  constructor() {
    NQDOM.documentReady(() => this._onLoad());
  }

  _createControl(ctor, element, template) {
    const control = new ctor(element, template);
    if (control._init) {
      control._init();
    }
    return control;
  }

  _onLoad() {
    const _elementToControlMap = new Map();
    for(const { name, ctor, template } of this._components) {
      const idToControlMap = new Map();
      const elementToControlMap = new Map();
      
      ctor.get = (id) => {
        return idToControlMap.get(id);
      };

      const elements = document.getElementsByClassName(template.rootClass);
      for (const element of elements) {
        const control = this._createControl(ctor, element, template);
        control._manager = this; // FIXME
        if (element.id) {
          idToControlMap.set(element.id, control);
          this._idToControlMap.set(element.id, control);
        }
        elementToControlMap.set(element, control);
        _elementToControlMap.set(element, control);

        this._controls.push(control);
      }
    }

    for (const control of this._controls) {
      const portClass = control.template.portClass;
      if (portClass) {
        const element = control.element;
        const portElm = NQDOM.getElementByClassName(element, portClass);
        portElm && Array.prototype.forEach.call(portElm.children, (iter) => {
          const childControl = _elementToControlMap.get(iter);
          if (childControl) {
            control.appendControl(childControl, true);
          }
        });
      }
    }

    for (const listener of this._listeners.load) {
      listener();
    }
  }

  createControl(name, params) {
    let component;
    if (typeof name === 'string') {
      component = this._components.find((i) => i.name === name);
    }
    else if (typeof name === 'function') {
      component = this._components.find((i) => i.ctor === name);
    }
    if (component) {
      const element = component.createElement(document, params || {});
      return this._createControl(component.ctor, element, component.template);
    }
    return null;
  }

  appendControl(control) {
    const index = this._controls.indexOf(control);
    if (index !== -1) {
      console.warn(`The logic of the Control is broken`);
      return;
    }
    this._controls.push(control);
    const id = control.element.id;
    if (id) {
      idToControlMap.set(id, control);
      this._idToControlMap.set(id, control);
    }
  }

  removeControl(control) {
    const index = this._controls.indexOf(control);
    if (index === -1) {
      console.warn(`The logic of the Control is broken`);
      return;
    }
    this._controls.slice(index, 1);
    for (const [key, val ] of this._idToControlMap) {
      if (val === control) {
        this._idToControlMap.delete(key);
        break;
      }
    }
  }

  getConstructor(name) {
      const component = this._components.find((i) => i.name === name);
      return component ? component.ctor : undefined;
  }

  getControl(name) {
    if (typeof name === 'string') {
        name = this.getConstructor(name);
    }
    if (typeof name === 'function') {
      return this._controls.find((i) => i.constructor === name);
    }
    return undefined;
  }

  getControles(name) {
    if (typeof name === 'string') {
        name = this.getConstructor(name);
    }
    if (typeof name === 'function') {
      return this._controls.filter((i) => i.constructor === name);
    }
    return [];
  }

  register(name, ctor, createElement, template) {
    if (typeof ctor === 'function') {
      this._components.push({ name, ctor, createElement, template });
    }
  }

  addEventListener(type, listener) {
    this._listeners[type].push(listener);
  }
};
