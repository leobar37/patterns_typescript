type Listener<T> = (value: T) => void;
interface IEventEmmiter<T> {
  on(event: string, listener: Listener<T>): void;
  once(event: string, listener: Listener<T>): void;
  removeEventListeners(): void;
  emit(event: string, payload: T): void;
}
type Listeners<T> = Array<Listener<T>>;

class EventEmmiter<T> implements IEventEmmiter<T> {
  private listenersManager = new Map<string, Listeners<T>>();
  private onlyOnce = new Set<Listener<T>>();
  constructor() {}
  emit(event: string, payload: T): void {
    this.getListeners(event).forEach(listener => {
      if (this.onlyOnce.has(listener)) {
        this.onlyOnce.delete(listener);
        this.removeListener(event, listener);
      }
      listener(payload);
    });
  }
  private removeListener(event: string, listener: Listener<T>) {
    const newListeners = this.getListeners(event).filter(d => d !== listener);
    this.listenersManager.set(event, newListeners);
  }
  private getListeners(event: string) {
    return this.listenersManager.get(event) || [];
  }
  // rest of code ..

  removeEventListeners(): void {}
}

const emmiter = new EventEmmiter<string>();

emmiter.on('hello', name => {
  console.log('sub 1');

  console.log('Hello ' + name);
});

emmiter.once('hello', name => {
  console.log('sub  4 (once)');
  console.log('Hello ' + name);
});

setInterval(() => {
  emmiter.emit('hello', 'Leobar');
}, 1000);
