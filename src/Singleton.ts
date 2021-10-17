import { assertProps, PartialAssert } from './utils';
interface BaseRecord {
  id: string;
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

class TodosDatabase implements IDatabase<Todo> {
  nodes: Record<string, Todo> = {};
  // aqui podemos guardar la instancia
  private static _instance: TodosDatabase = null;

  // este método se encarga de exponer la instancia hacía el exterior
  public static get instance(): TodosDatabase {
    // si la instancia no existe es por que todavìa no ha sido creado
    if (TodosDatabase._instance == null) {
      TodosDatabase._instance = new TodosDatabase();
    }
    return TodosDatabase._instance;
  }
  private constructor() {}
  find(id: string): Todo {
    return this.nodes[id];
  }
  findAll(properties: PartialAssert<Todo>): Todo[] {
    const find = assertProps(Object.values(this.nodes));
    return find(properties);
  }
  insert(node: Todo): void {
    this.nodes[node.id] = node;
  }
  delete(id: string): Todo {
    const deleted = this.nodes[id];
    delete this.nodes[id];
    return deleted;
  }
}

const todoDatabase = TodosDatabase.instance;

TodosDatabase.instance.insert({
  done: false,
  id: '1',
  priority: 2,
  title: 'Sleep early'
});

TodosDatabase.instance.insert({
  done: true,
  id: '2',
  priority: 2,
  title: 'do the laudry'
});

const todosCheked = TodosDatabase.instance.findAll({
  title: (title: string) => {
    return title.indexOf('do') != -1;
  },
  done: true
});
