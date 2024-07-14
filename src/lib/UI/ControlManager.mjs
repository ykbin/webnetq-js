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

  _createControl(ctor, element) {
    const control = new ctor(element, ctor.template);
    if (control._init) {
      control._init();
    }
    return control;
  }

  _onLoad() {
    const _elementToControlMap = new Map();
    for(const { ctor, template } of this._components) {
      const idToControlMap = new Map();
      const elementToControlMap = new Map();
      
      ctor.get = (id) => {
        return idToControlMap.get(id);
      };

      const elements = document.getElementsByClassName(template.rootClass);
      for (const element of elements) {
        const control = this._createControl(ctor, element);
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

  createControl(param) {
    let component;
    if (typeof param === 'string') {
      component = this._components.find((i) => i.template.name === param);
    }
    else if (typeof param === 'function') {
      component = this._components.find((i) => i.ctor === param);
    }
    if (component) {
      const rootHTML = component.template.rootHTML;
      const element = NQDOM.createElement(rootHTML);
      return this._createControl(component.ctor, element);
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

  getControl(param) {
    if (typeof param === 'function') {
      return this._controls.find((i) => i.constructor === param);
    }
    if (typeof param === 'string') {
      return this._controls.find((i) => i.template.name === param);
    }
    return undefined;
  }

  getControles(param) {
    if (typeof param === 'function') {
      return this._controls.filter((i) => i.constructor === param);
    }
    if (typeof param === 'string') {
      return this._controls.filter((i) => i.template.name === param);
    }
    return [];
  }

  register(ctor, template) {
    if (typeof ctor === 'function') {
      this._components.push({ ctor, template });
    }
  }

  addEventListener(type, listener) {
    this._listeners[type].push(listener);
  }
};
