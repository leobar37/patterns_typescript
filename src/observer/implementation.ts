type Unsuscribe = () => void;

type Listener<T> = (value: T) => void;

export interface ISubject<T> {
  suscribe(listener: Listener<T>): Unsuscribe;
}

export class Subject<T> implements ISubject<T> {
  listeners = new Set<Listener<T>>();
  next(value: T): void {
    this.listeners.forEach(listener => listener(value));
  }
  suscribe(listener: Listener<T>): Unsuscribe {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

const obs = new Subject<string>();

obs.next('hello');

obs.suscribe(d => {
  console.log('suscriber 1');
  console.log(d);
});

obs.next('World');

obs.suscribe(d => {
  console.log('suscriber 2');
  console.log(d);
});

obs.next('bye');
