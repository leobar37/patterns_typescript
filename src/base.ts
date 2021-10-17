// interface Pokemon {
//   id: string;
//   attack: number;
//   defense: number;
// }

// interface BaseRecord {
//   id: string;
// }

// interface Database<T extends BaseRecord> {
//   set(newValue: T): void;
//   get(id: string): T | undefined;
// }

// class InMemoryDatabase<T extends BaseRecord> implements Database<T> {
//   private bd: Record<string, T> = {};
//   set(newValue: T): void {
//     this.bd[newValue.id] = newValue;
//   }
//   get(id: string): T | undefined {
//     return this.bd[id];
//   }
// }

// // factory pattern

// const bd = new InMemoryDatabase<Pokemon>();

// bd.set({
//   attack: 5,
//   defense: 5,
//   id: 'one'
// });

// console.log(bd.get('one'));
