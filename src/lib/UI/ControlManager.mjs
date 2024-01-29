import { NQDOM } from '../../index.mjs';

let s_instance = null;

export default class ControlManager {
  static getInstance() {
    if (!s_instance) {
      s_instance = new ControlManager;
    }
    return s_instance;
  }

  _constructorControls = [];
  _controls = [];
  _elementToControlMap = new Map();
  _idToControlMap = new Map();
  _listeners = {
    load: [],
  };

  constructor() {
    NQDOM.documentReady(() => this._onLoad());
  }

  _onLoad() {
    const _manager = this;
    for(const Control of this._constructorControls) {
      const idToControlMap = new Map();
      const elementToControlMap = new Map();
      
      Control.get = (id) => {
        return idToControlMap.get(id);
      };

      const elements = document.getElementsByClassName(Control.template.rootClass);
      for (const element of elements) {
        const control = new Control(element);
        Object.defineProperty(control, "manager", {
          value: _manager,
          writable: false,
          configurable: false,
          enumerable: false,
        });

        if (element.id) {
          idToControlMap.set(element.id, control);
          this._idToControlMap.set(element.id, control);
        }
        elementToControlMap.set(element, control);
        this._elementToControlMap.set(element, control);

        this._controls.push(control);
      }
    }

    for (const control of this._controls) {
      const portClass = control.constructor.template.portClass;
      if (portClass) {
        const element = control.element;
        const portElm = NQDOM.getElementByClassName(element, portClass);
        portElm && Array.prototype.forEach.call(portElm.children, (iter) => {
          const childControl = this._elementToControlMap.get(iter);
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
    if (typeof param === 'string') {
      const Constructor = this._constructorControls.find((i) => i.template.name === param);
      if (Constructor) {
        const rootHTML = Constructor.template.rootHTML;
        const element = NQDOM.createElement(rootHTML);
        const _manager = this;
        const control = new Constructor(element);
        Object.defineProperty(control, "manager", {
          value: _manager,
          writable: false,
          configurable: false,
          enumerable: false,
        });
        return control;
      }
    }
    return null;
  }

  getControl(param) {
    if (typeof param === 'function') {
      return this._controls.find((i) => i.constructor === param);
    }
    if (typeof param === 'string') {
      return this._controls.find((i) => i.constructor.template.name === param);
    }
    return undefined;
  }

  getControles(param) {
    if (typeof param === 'function') {
      return this._controls.filter((i) => i.constructor === param);
    }
    if (typeof param === 'string') {
      return this._controls.filter((i) => i.constructor.template.name === param);
    }
    return [];
  }

  register(ControlConstructor) {
    if (typeof ControlConstructor === 'function') {
      this._constructorControls.push(ControlConstructor);
    }
  }

  addEventListener(type, listener) {
    this._listeners[type].push(listener);
  }
};
