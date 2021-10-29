import { assertProps, PartialAssert } from '../../utils';
import { nanoid } from 'nanoid';
import { EventEmmiter } from '../../observer/events';
export interface BaseRecord {
  id?: string | number;
}

interface IDatabase<T extends BaseRecord> {
  find(id: string): T;
  findAll(properties: PartialAssert<T>): T[];
  insert(node: T): void;
  delete(id: string): T;
}

export interface IConfig {
  typeId: 'uuid' | 'manual' | 'incremental';
}
enum DEvents {
  onBeforeSave = 'onBeforeSave',
  onAfterSave = 'onAfterSave'
}

export function createEntity<T extends BaseRecord>({ typeId }: IConfig) {
  class Database implements IDatabase<T> {
    nodes: Record<string, T> = {};

    private eventsManager = new EventEmmiter<T>();
    onBeforeSave(listener: (node: T) => void) {
      this.eventsManager.on(DEvents.onBeforeSave, listener);
    }

    onAfterSave(listener: () => void) {
      this.eventsManager.on(DEvents.onAfterSave, listener);
    }
    // aqui podemos guardar la instancia
    private static _instance: Database | null = null;
    private _lastInserted!: T;
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
      this.eventsManager.emit(DEvents.onBeforeSave, node);
      const id = this.generateId();
      if (id !== null) {
        node = {
          ...node,
          id
        };
      }
      this.nodes[node.id!] = node;
      this._lastInserted = node;
      this.eventsManager.emit(DEvents.onAfterSave, node);
    }
    delete(id: string): T {
      const deleted = this.nodes[id];
      delete this.nodes[id];
      return deleted;
    }
  }
  return Database.instance;
}
