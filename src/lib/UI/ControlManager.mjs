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
  _idToControlMap = new Map();
  _listeners = {
    load: [],
  };

  constructor() {
    NQDOM.documentReady(() => this._onLoad());
  }

  _createControl(Control, element) {
    const control = new Control(element);
    if (control._init) {
      control._init();
    }
    return control;
  }

  _onLoad() {
    const _elementToControlMap = new Map();
    for(const Constructor of this._constructorControls) {
      const idToControlMap = new Map();
      const elementToControlMap = new Map();
      
      Constructor.get = (id) => {
        return idToControlMap.get(id);
      };

      const elements = document.getElementsByClassName(Constructor.template.rootClass);
      for (const element of elements) {
        const control = this._createControl(Constructor, element);
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
      const portClass = control.constructor.template.portClass;
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
    if (typeof param === 'string') {
      const Constructor = this._constructorControls.find((i) => i.template.name === param);
      if (Constructor) {
        const rootHTML = Constructor.template.rootHTML;
        const element = NQDOM.createElement(rootHTML);
        return this._createControl(Constructor, element);
      }
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
