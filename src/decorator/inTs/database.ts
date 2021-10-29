import { PartialAssert } from '../../utils';
import { createEntity, IConfig } from './Entity.decorator';
export interface BaseRecord {
  id?: string | number;
}
export interface IEntity<T extends BaseRecord> {
  find(id: string): T;
  findAll(properties: PartialAssert<T>): T[];
  insert(node: T): void;
  delete(id: string): T;
}
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type ObjectType<T> = { new (): T } | Function;

export class BaseEntity {
  private static repo<T>(): IEntity<T> {
    return getRepository(this);
  }
  public static find<T>(id: string): T {
    return this.repo().find(id) as SafeAny;
  }
  public static findAll<T>(properties: PartialAssert<T>): T[] {
    return this.repo().findAll(properties) as SafeAny;
  }
  public static insert<T>(this: SafeAny, node: Partial<T>): void {
    return this.repo().insert(node);
  }
  public static delete<T>(id: string): T {
    return this.repo().delete(id) as SafeAny;
  }
}

type DatabaseOptions = {} & IConfig;

type SafeAny = any;

const BS_LISTENERS = Symbol('before_save');
const AS_LISTENERS = Symbol('as_listeners');

export function Entity(options: DatabaseOptions) {
  return function (target: Object) {
    const database = createEntity({
      typeId: options.typeId
    });
    const bsListeners: SafeAny[] =
      Reflect.getMetadata(BS_LISTENERS, target) || [];
    const asListeners: SafeAny[] =
      Reflect.getMetadata(AS_LISTENERS, target) || [];

    asListeners.forEach(listener => database.onAfterSave(listener));
    bsListeners.forEach(listener =>
      database.onBeforeSave(node => listener.bind(node)())
    );

    Reflect.defineMetadata('repository', database, target);
  };
}
export const getRepository = (target: Object) => {
  return Reflect.getMetadata('repository', target);
};

export function onBeforeSave(): MethodDecorator {
  return (target, key, descriptor) => {
    const fn = descriptor.value;
    let listeners: SafeAny[] = Reflect.getMetadata(BS_LISTENERS, target) || [];
    listeners.push(fn);
    Reflect.defineMetadata(BS_LISTENERS, listeners, target.constructor);
  };
}
export function onAfterSave(): MethodDecorator {
  return (target, key, descriptor) => {
    const fn = descriptor.value;
    let listeners: SafeAny[] = Reflect.getMetadata(AS_LISTENERS, target) || [];
    listeners.push(fn);
    Reflect.defineMetadata(AS_LISTENERS, listeners, target.constructor);
  };
}
