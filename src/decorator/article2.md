#

El patrón decorator es un patrón estructural que nos ayuda a poder agregar funcionalidades a una clase de manera dinámica.

Lo primero que se nos viene a la mente a la hora de extender la funcionaliadad a una clase es la herencia.

Si quisieramos compararlo con la vidad real podria ser con una hamburgueria. Primero tendriamos el proceso general, el cual es tomar el pedido y entregarlo al cliente, el cliente pide una hamburguesa , una gaseosa y que de todas las cremas solo quiere mayonesa.

Como el proceso general sigue siendo el mismo, que es entregar el pedido todos estos procesos reciben el pedido como si fueran el "cliente" , pero en realidad no lo son solo van agregar cosas, por ejemplo, salio la hamburguesa , la de las gaseosas tomo el pedido y le puso una gaseosa y la delega para que le pongan cremas. El punto que quiero llegar es que si el cliente no hubiera agregado gaseseosa. Simplemente nos hubieramos ahorrado el proceso de agregar gasesoa.

Se que es un poco tonto el ejemplo. Pero fue lo único que se me ocurrio,llevemos esto a codigo.

```ts
type Order = string[];
interface Detail {
  creams: {
    mayonnaise: boolean;
    ketchup: boolean;
  };
  soda: boolean;
}

interface ICustomerService {
  receiveOrder(detail: Detail): void;
  deliverOder(): Order;
}
```

Este seria mi plantemiento inicial, Ahora implementemos esto en una clase

```ts
class DeliverHamburguer implements ICustomerService {
  receiveOrder(detail: Detail): void {
    console.log('details');
    console.log(detail);
  }
  deliverOder(): Order {
    return ['A hamburguer'];
  }
}
```

Aqui es donde entra en juego el patrón decorator. ¿Por qué?. Bueno quizas en un ejemplo real, planteaste desde un inicio, poder entregar gaseosas y cremas, pero aqui vamos a manejar las gasesosas y las cremas como funcionalidades por aparte suponiendo
que recibir y entregar la hamburguesa es un montón de codigo y agregar
la venta de gaseosas sería a aún mas codigo.

Entonces ahora quieres poder agregar mayonesas a tu hamburguesa. Como solución
aqui se podría plantear la herencia extendiendes la clase y agregar otra funcionalidad , pero después de un tiempo quieres vender gasesosas , y esta sería
otra funcionalidad, emplear herencia traeria consigo unos problemas:

1. **La herencia es estática:** No podemos alterar las clases en tiempo de ejecución.
2. **Solo se puede extender de una sola clase:** En el caso de javascript solo podemos extender desde una sola clase.Si quisieramos agregar funcionalidad se tendria que heredar clase tras clase.

Ahora volvamos codigo, El patrón decorator propone crear una clase a la cual llamaremos **wrapper** que lo que hace es tomar el objeto y delegar sus solicitudes, por eso tiene que implementar la misma interfaz que el objeto objetivo en este caso `ICustomerService`.

```ts
class CustomerServiceBaseDecorator implements ICustomerService {
  wrappee: ICustomerService;
  constructor(obj: ICustomerService) {
    this.wrappee = obj;
  }
  receiveOrder(detail: Detail): void {
    this.wrappee.receiveOrder(detail);
  }
  deliverOder(): Order {
    return this.wrappee.deliverOder();
  }
}
```

Como se puede observar `wrappe` es cualquier objeto que implemente la interfaz `ICustomerService`. El chiste viene que las clase que extiendan esta clase, pueden llamar a `super.receiveOrder()` o `super.deliverOder()` y estaria llamando a los metodos de la clase del objeto pasado (delegar solicitudes).

```ts
class CreamsDecorator extends CustomerServiceBaseDecorator {
  detail: Detail;
  deliverOder() {
    const order = super.deliverOder();
    if (this.detail.creams.ketchup) {
      order.push('Add ketchup');
    }
    if (this.detail.creams.mayonnaise) {
      order.push('Add mayonnaise');
    }
    return order;
  }
  receiveOrder(details: Detail) {
    this.detail = details;
    super.receiveOrder(details);
  }
}
```

Todos los objetos que extiendan al wrapper son decoradores, en este caso este es un decorador encargado de manajar las cremas veamos un poco a detalle esto.

- EL método `deliverOrder` ejecuta primero el método del objetivo,manipula la orden y la retorna.

- En el método `receiveOrder` primero guardamos el detalle de la orden y después pasamos la petición, recuerda que estas llamando el método de la clase puedes probar
  poniendo `this` y ocasionar una recurción infinita.

Esta es la razón de existir de decorator, puedes manipular las solicitudes antes y después y en base a esto agregar más funcionalidades. Ahora implementemos las sodas.

```ts
class SodasDecorator extends CustomerServiceBaseDecorator {
  detail: Detail;
  deliverOder() {
    const order = super.deliverOder();
    if (this.detail.soda) {
      order.push('Add Soda');
    }
    return order;
  }
  receiveOrder(details: Detail) {
    this.detail = details;
    super.receiveOrder(details);
  }
}
```

Listo ahora veamos como funcionaria esto

```ts
let detail: Detail = {
  creams: {
    ketchup: true,
    mayonnaise: true
  },
  soda: true
};

const services = {
  sodas: true,
  creams: true
};

let obj = new DeliverHamburguer();

if (services.creams) {
  const creamsDecorator = new CreamsDecorator(obj);
  obj = creamsDecorator;
}

if (services.sodas) {
  const sodasDecorator = new SodasDecorator(obj);
  obj = sodasDecorator;
}

obj.receiveOrder(detail);

console.log(obj.deliverOder());
// OUTPUT: [ 'A hamburguer', 'Add ketchup', 'Add mayonnaise', 'Add Soda' ]
```

Bien, ahora supongamos que por A/B razón ya no se puede ofrecer gaseosas, ya
te puedes imaginar lo facíl que es quitar esa funcionalidad

Ahora veamos un segundo ejemplo.

Supongamos que estamos haciendo una aplicación de mensajería y te toca
programar la parte del envío.

```ts
interface Sender {
  send(data: string, receiver: number): void;
}

class SenderMessage implements Sender {
  send(data: string, receiver: number) {
    console.log('data send');
    console.log(data);
  }
}
```

Ahora apliquemos decorador para poder extender las funcionalides de una clase a futuro.

```ts
class SenderMessageDecorator implements Sender {
  private wrapper: Sender;
  constructor(sender: Sender) {
    this.wrapper = sender;
  }
  send(data: string, receiver: number): void {
    this.wrapper.send(data, receiver);
  }
}
```

Listo, ahora se te pide realizar una backup de los mensajes.

```ts
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
```

Listo , ahora se nos ocurre que sería bueno implementar filtros de palabras, por
si alguién se le ocurre decir groserias.

```ts
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
```

Ahora no contentos con eso se nos ocurre agregar una estructua al mensaje de manera
que sea `receiver:message`.

```ts
class NormalizeText extends SenderMessageDecorator {
  send(data: string, receiver: number) {
    const normalized = `${receiver}:${data}`;
    super.send(normalized, receiver);
  }
}
```

Aún no contentos con eso , se nos ocurre agregar eventos para notificar el antes
y después del envio del mensaje.

```ts
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
```

Por cierto la clase `Subject` viene del patrón observer del anterior post, codigo [aquí](https://link).Listo suficiente :).

Ahora probemos lo que hemos echo.

```ts
let options = {
  backup: false,
  events: false,
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
```

la data ha sido normalizada, los eventos estan funcionando, la backup se realiza y no lanzo una alerta de que la ultima palabra no se envió.
