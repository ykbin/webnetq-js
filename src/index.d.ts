type ControlConstructor<T extends BaseControl> = new (...args: any[]) => T;

export interface ControlManager {
  static getInstance(): ControlManager;

  createControl<T>(param: ControlConstructor<T> | string): BaseControl;
  appendControl(control: BaseControl): void;
  removeControl(control: BaseControl): void;
  getControl<T>(param: ControlConstructor<T> | string): BaseControl;
  getControles(param: ControlConstructor<T> | string): BaseControl;
  register<T>(ctor: ControlConstructor<T>, template: any): void;

  addEventListener(type: string, listener: (event: any) => void): void;
};

export interface BaseControl {
  get element(): HTMLElement;
  get dataset(): DOMStringMap;
  get template(): any;

  show(): void;
  hide(): void;

  getControl<T>(param: ControlConstructor<T> | string): BaseControl | undefined;
  getControles<T>(param: ControlConstructor<T> | string): BaseControl[];

  setManager(manager: ControlManager): void;
  insertControl(position: number, control: BaseControl, attachControl?: BaseControl): void;
  appendControl(control: BaseControl, attachControl?: BaseControl);
  removeControl(control: BaseControl): void;
  replaceChildren(): void;
  remove(): void;

  registerEvent(...args: amy[]): void;
  dispatchEvent(type: string, event: any): void;
  addEventListener(type: string, listener: (event: any) => void): void;
};
