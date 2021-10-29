// import {
//   Entity,
//   BaseEntity,
//   BaseRecord,
//   onAfterSave,
//   onBeforeSave
// } from './database';
// import 'reflect-metadata';
// interface ITodo extends BaseRecord {
//   title: string;
//   done: boolean;
//   priority: number;
// }

// @Entity({
//   typeId: 'uuid'
// })
// class Todo extends BaseEntity {
//   done!: boolean;
//   id!: string;
//   priority!: number;
//   title!: string;
// }

// Todo.insert({
//   done: true,
//   priority: 5,
//   title: 'Hello'
// } as ITodo);

// console.log(Todo.findAll({ done: true }));

function print(target: any) {
  return class extends target {
    printVersion = 1;

    print() {
      const toString = Object.entries(this).reduce(
        (prev, curr) => prev + `${curr[0]} : ${curr[1]}\n`,
        ''
      );
      console.log(toString);
    }
  } as any;
}

interface Person {
  print(): void;
}

function noise(target: any) {
  return class extends target {
    constructor(...args: any[]) {
      console.log('Hello friend I am instantiating');
      super(args);
      console.log('i am already instantiated');
    }
  } as any;
}

function uppercase(target: Object, key: string | symbol) {
  let value: string | null = (target as any)[key];

  const setter = (val: string) => {
    value = val.toLocaleUpperCase();
  };
  const getter = () => {
    return value;
  };
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: false,
    set: setter,
    get: getter
  });
}

@noise
@print
class Person {
  @uppercase
  name = 'leo';

  age = 10;
  constructor() {
    console.log(':o');
  }
}

const person = new Person();

// person.print();

console.log(person.name);
