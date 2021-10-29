/**
 *
 */
import { Subject } from '../observer/implementation';

interface Sender {
  send(data: string, receiver: number): void;
}
class SenderMessage implements Sender {
  send(data: string, receiver: number) {
    console.log('data send');
    console.log(data);
  }
}

class SenderMessageDecorator implements Sender {
  private wrapper: Sender;
  constructor(sender: Sender) {
    this.wrapper = sender;
  }
  send(data: string, receiver: number): void {
    this.wrapper.send(data, receiver);
  }
}

class BackupMessages extends SenderMessageDecorator {
  backup = new Map<number, string>();
  getBackup() {
    return Array.from(this.backup.values()).join('\n');
  }
  send(data: string, receiver: number) {
    this.backup.set(receiver, data);
    super.send(data, receiver);
  }
}

type Filter = (data: string) => boolean;
class DecoratorFilters extends SenderMessageDecorator {
  filters: Filter[] = [];
  setFilters(...filters: Filter[]) {
    this.filters = filters;
  }
  send(data: string, receiver: number) {
    const canbe = this.filters.every(filter => filter(data));
    if (!canbe) {
      console.error(
        data + ' is not permitted by the filters and will not be sent'
      );

      return;
    }
    super.send(data, receiver);
  }
}

class NormalizeText extends SenderMessageDecorator {
  send(data: string, receiver: number) {
    const normalized = `${receiver}:${data}`;
    super.send(normalized, receiver);
  }
}

class EventsDecorator extends SenderMessageDecorator {
  beforeSendObserver = new Subject<void>();
  afterSendObserver = new Subject<void>();
  onBeforeSend(callback: () => void) {
    this.beforeSendObserver.suscribe(callback);
  }
  onAfterSend(callback: () => void) {
    this.afterSendObserver.suscribe(callback);
  }
  send(data: string, receiver: number) {
    this.beforeSendObserver.next();
    super.send(data, receiver);
    setTimeout(() => {
      this.afterSendObserver.next();
    }, 1000);
  }
}

let options = {
  backup: true,
  events: true,
  normalize: true,
  filters: true
};
let sender = new SenderMessage();

if (options.backup) {
  const backup = new BackupMessages(sender);
  sender = backup;
  setTimeout(() => {
    console.log('backup');
    console.log((backup as BackupMessages).getBackup());
  }, 1500);
}

if (options.events) {
  const events = new EventsDecorator(sender);
  sender = events;
  events.onBeforeSend(() => {
    console.log('after send');
  });
  events.onBeforeSend(() => {
    console.log('before send');
  });
}

if (options.normalize) {
  sender = new NormalizeText(sender);
}

if (options.filters) {
  const filters = new DecoratorFilters(sender);
  sender = filters;
  const barWords = (data: string) => {
    return data !== 'shit';
  };
  filters.setFilters(barWords);
}

sender.send('Hello', 1);
sender.send('Hello', 2);
sender.send('Hello', 3);
sender.send('Hello', 4);
sender.send('shit', 5);
