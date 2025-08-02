declare module "webnetq-js" {

namespace NQDOM {

function documentReady(callback: (args: any) => void): void;
function documentDescription(): string;
function createElement(html: string): HTMLElement | undefined;
function getElementByClassName(element: HTMLElement, className: string): HTMLElement | undefined;
function escapeHTML(str: string): string;
function setTextContent(val: HTMLElement | string, text: string): void;

} // namespace NQDOM

namespace Random {

function nextUint(): number;
function nextElementId(): string;
function nextPathComponent(length?: number): string;

} // namespace Random

type ControlConstructor<T extends BaseControl> = new (...args: any[]) => T;

export abstract class ControlManager {
  getInstance(): ControlManager;

  createControl<T extends BaseControl>(param: ControlConstructor<T> | string): BaseControl;
  appendControl<T extends BaseControl>(control: T): void;
  removeControl<T extends BaseControl>(control: T): void;
  getControl<T extends BaseControl>(param: ControlConstructor<T> | string): BaseControl;
  getControles<T extends BaseControl>(param: ControlConstructor<T> | string): BaseControl;
  register<T extends BaseControl>(ctor: ControlConstructor<T>, template: any): void;

  addEventListener(type: string, listener: (event: any) => void): void;
}

export abstract class BaseControl {
  get element(): HTMLElement;
  get dataset(): DOMStringMap;
  get template(): any;

  show(): void;
  hide(): void;

  getControl<T extends BaseControl>(param: ControlConstructor<T> | string): BaseControl | undefined;
  getControles<T extends BaseControl>(param: ControlConstructor<T> | string): BaseControl[];

  setManager(manager: ControlManager): void;
  insertControl(position: number, control: BaseControl, attachControl?: BaseControl): void;
  appendControl(control: BaseControl, attachControl?: BaseControl): void;
  removeControl(control: BaseControl): void;
  replaceChildren(): void;
  remove(): void;

  registerEvent(...args: any[]): void;
  dispatchEvent(type: string, event: any): void;
  addEventListener(type: string, listener: (event: any) => void): void;
}

} // module "webnetq-js"
