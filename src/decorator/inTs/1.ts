import 'reflect-metadata';
import { Entity, BaseRecord, IEntity, EntityMethods } from './database';

interface Todo extends BaseRecord {
  title: string;
  done: boolean;
  priority: number;
}

@Entity({})
class ITodo extends EntityMethods<Todo> {}

// class decorator

// method decorator

// property decorator
