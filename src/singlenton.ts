namespace singlenton {
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
  }

  // factory pattern

  function createDatabase<T extends BaseRecord>() {
    class InMemoryDatabase implements Database<T> {
      private bd: Record<string, T> = {};
      // Singlenton
      public static instance: InMemoryDatabase = new InMemoryDatabase();
      private constructor() {
        console.log('hell i am a new instance :)');
      }

      set(newValue: T): void {
        this.bd[newValue.id] = newValue;
      }
      get(id: string): T | undefined {
        return this.bd[id];
      }
    }
    return InMemoryDatabase;
  }

  const PokemonDb = createDatabase<Pokemon>();

  PokemonDb.instance.set({
    id: 'one',
    attack: 5,
    defense: 5
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
