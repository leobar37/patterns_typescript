import { assertProps, PartialAssert } from '../utils';
import { nanoid } from 'nanoid';
interface BaseRecord {
  id?: string | number;
}
interface IDatabase<T extends BaseRecord> {
  find(id: string): T;
  findAll(properties: PartialAssert<T>): T[];
  insert(node: T): void;
  delete(id: string): T;
}

interface Todo extends BaseRecord {
  title: string;
  done: boolean;
  priority: number;
}

interface Product extends BaseRecord {
  name: string;
  price: number;
}

function createDatabase<T extends BaseRecord>() {
  class Database implements IDatabase<T> {
    nodes: Record<string, T> = {};
    private static _instance: Database = null;
    public static get instance(): Database {
      if (Database._instance == null) {
        Database._instance = new Database();
      }
      return Database._instance;
    }
    private constructor() {}

    find(id: string): T {
      return this.nodes[id];
    }
    findAll(properties: PartialAssert<T>): T[] {
      const find = assertProps(Object.values(this.nodes));
      return find(properties);
    }

    insert(node: T): void {
      this.nodes[node.id] = node;
      this._lastInserted = node;
    }
    delete(id: string): T {
      const deleted = this.nodes[id];
      delete this.nodes[id];
      return deleted;
    }
  }
  return Database;
}

const TodosDatabase = createDatabase<Todo>();
const ProductDatabase = createDatabase<Product>();

TodosDatabase.instance.insert({
  done: false,
  priority: 2,
  title: 'Sleep early'
});

TodosDatabase.instance.insert({
  done: true,
  priority: 2,
  title: 'do the laudry'
});

ProductDatabase.instance.insert({
  name: 'Product 1',
  price: 5
});

TodosDatabase.instance.findAll({
  done: false
});

console.log(TodosDatabase.instance.findAll({}));
