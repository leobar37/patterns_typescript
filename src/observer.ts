export type Listener<EventType> = (event: EventType) => void;

// observer pattern

export type Observer<EventType> = {
  suscribe: (listener: Listener<EventType>) => () => void;
  publish: (event: EventType) => void;
};

export function createObserver<EventType>(): Observer<EventType> {
  const listeners = new Set<Listener<EventType>>();
  return {
    suscribe: listener => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    publish: event => {
      for (const listener of listeners.values()) {
        listener(event);
      }
    }
  };
}

const observer = createObserver<string>();

const unsuscribe = observer.suscribe(d => {
  console.log('Event', d);
});

observer.publish('Hello');
observer.publish('Observer');
unsuscribe();
observer.publish('pattern');

namespace ObserverImpl {
  // import { Observer, Listener, createObserver } from './observer';

  type BeforeSaveEvent<T> = {
    value: T;
    newValue: T;
  };

  type AfterSaveEvent<T> = {
    value: T;
  };

  interface Pokemon {
    id: string;
    attack: number;
    defense: number;
  }

  interface BaseRecord {
    id: string;
  }

  interface Database<T extends BaseRecord> {
    set(newValue: T): void;
    get(id: string): T | undefined;
    onBeforeSave(listener: Listener<BeforeSaveEvent<T>>): () => void;
    onAfterSave(listener: Listener<AfterSaveEvent<T>>): () => void;
  }

  // factory pattern

  function createDatabase<T extends BaseRecord>() {
    class InMemoryDatabase implements Database<T> {
      private bd: Record<string, T> = {};
      private beforeSaveObserver = createObserver<BeforeSaveEvent<T>>();
      private afterSaveObserver = createObserver<AfterSaveEvent<T>>();

      // Singlentin this is callen only once
      public static instance: InMemoryDatabase = new InMemoryDatabase();
      private constructor() {
        console.log('hell i am a new instance :)');
      }
      onBeforeSave(listener: Listener<BeforeSaveEvent<T>>): () => void {
        return this.beforeSaveObserver.suscribe(listener);
      }
      onAfterSave(listener: Listener<AfterSaveEvent<T>>): () => void {
        return this.afterSaveObserver.suscribe(listener);
      }

      set(newValue: T): void {
        const prevValue = this.bd[newValue.id];
        this.beforeSaveObserver.publish({
          newValue: newValue,
          value: prevValue
        });
        this.bd[newValue.id] = newValue;
        this.afterSaveObserver.publish({
          value: newValue
        });
      }
      get(id: string): T | undefined {
        return this.bd[id];
      }
    }
    return InMemoryDatabase;
  }

  const PokemonDb = createDatabase<Pokemon>();

  const bdPokemon = PokemonDb.instance;
  bdPokemon.onAfterSave(d => {
    console.log('on after save');

    console.log(d);
  });

  bdPokemon.onBeforeSave(d => {
    console.log('on before save');

    console.log(d);
  });

  PokemonDb.instance.set({
    id: 'one',
    attack: 5,
    defense: 5
  });

  PokemonDb.instance.set({
    id: 'one',
    attack: 5,
    defense: 6
  });
  PokemonDb.instance.set({
    id: 'two',
    attack: 5,
    defense: 5
  });

  PokemonDb.instance.set({
    id: 'three',
    attack: 5,
    defense: 5
  });

  console.log(PokemonDb.instance.get('one'));
  console.log(PokemonDb.instance.get('two'));
}
