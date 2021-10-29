type Listener<T> = (value: T) => void;
interface IEventEmmiter<T> {
  on(event: string, listener: Listener<T>): void;
  once(event: string, listener: Listener<T>): void;
  removeEventListeners(): void;
  emit(event: string, payload: T): void;
}
type Listeners<T> = Array<Listener<T>>;

export class EventEmmiter<T> implements IEventEmmiter<T> {
  private listenersManager = new Map<string, Listeners<T>>();
  private onlyOnce = new Set<Listener<T>>();
  constructor() {}
  private getListeners(event: string) {
    return this.listenersManager.get(event) || [];
  }
  private removeListener(event: string, listener: Listener<T>) {
    const newListeners = this.getListeners(event).filter(d => d !== listener);
    this.listenersManager.set(event, newListeners);
  }
  emit(event: string, payload: T): void {
    this.getListeners(event).forEach(listener => {
      if (this.onlyOnce.has(listener)) {
        this.onlyOnce.delete(listener);
        this.removeListener(event, listener);
      }
      listener(payload);
    });
  }
  on(event: string, listener: Listener<T>): void {
    const listeners = this.getListeners(event);
    listeners.push(listener);
    this.listenersManager.set(event, listeners);
  }
  once(event: string, listener: Listener<T>): void {
    this.onlyOnce.add(listener);
    this.on(event, listener);
  }
  removeEventListeners(): void {
    this.onlyOnce = new Set();
    this.listenersManager = new Map();
  }
}
