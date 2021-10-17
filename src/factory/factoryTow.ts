import { assertProps, PartialAssert } from '../utils';
import { nanoid } from 'nanoid';
export interface BaseRecord {
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
interface IConfig {
  typeId: 'uuid' | 'manual' | 'incremental';
}
export function createDatabase<T extends BaseRecord>({ typeId }: IConfig) {
  class Database implements IDatabase<T> {
    nodes: Record<string, T> = {};
    // aqui podemos guardar la instancia
    private static _instance: Database = null;
    private _lastInserted: T;
    // este método se encarga de exponer la instancia hacía el exterior
    public static get instance(): Database {
      // si la instancia no existe es por que todavìa no ha sido creado
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

    private generateId() {
      switch (typeId) {
        case 'incremental': {
          if (!this._lastInserted) {
            return 0;
          } else {
            const id = this._lastInserted.id as number;
            return id + 1;
          }
        }
        case 'uuid': {
          return nanoid();
        }
        case 'manual': {
          return null;
        }
      }
    }

    insert(node: T): void {
      const id = this.generateId();
      if (id !== null) {
        node = {
          ...node,
          id
        };
      }

      this.nodes[node.id] = node;
      this._lastInserted = node;
    }
    delete(id: string): T {
      const deleted = this.nodes[id];
      delete this.nodes[id];
      return deleted;
    }
  }
  return Database.instance;
}
