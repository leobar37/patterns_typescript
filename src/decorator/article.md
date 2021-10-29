# Decorator pattern (parte 1)

El patrón decorator es un patrón estructural que nos ayuda a poder agregar funcionalidades a una clase de manera dinamica.

Lo primero que se nos viene a la mente a la hora de extender la funcionaliadad a una clase es la herencia.

Por ejemplo, suponiendo que trabajamos en una biblioteca de mensajería, para lo cual tenemos la siguiente clase.

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

Esto funciona bien, la clase `SenderMessage` tiene como rol enviar los mensajes, pero tiempo después
se presenta el requerimiento de que en ciertos casos, deberiamos de guardar los mensajes.
Para eso podriamos hacer lo siguiente.

```ts
class SenderMessageWithBackup extends SenderMessage {
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

Ahora tiempo después se presenta otro requirimiento,se nos dice que deberiamos agregar una funcionalidad
de filtros para determinar si un mensaje debería o no enviarse.

Entonces ahora tendriamos alguna clase extra que extienda de `SenderMessageWithBackup` pero hacer
esto nos presentaria unos cuantos inconvenientes.

- ¿Que pasaría en un futuro ya no se quiere la funcionalidad de backup? : La solución podria ser separar cada funcionalidad
  por separado pero recordemos que solo podemos heredar una sola clase.

- ¿Que pasaría si quieres agregar y quitar las funcionalidades dinamicamente?. La herencia es estática, no se puede alterar
  la funcionalidad de una clase en tiempo de ejecución.

Aqui es donde entra en juego el patrón decorador.

Empecemos con la implementación.

Ahora en vez de utilizar herencia podemos usar composición o agregación
lo cual consiste en que el trabajo se delega a otro objeto,puedes ver más de este concepto aquí [aquí](https://www.visual-paradigm.com/guide/uml-unified-modeling-language/uml-aggregation-vs-composition/).

Lo primero que vamos ha hacer es crear la clase y la interfaz que define los métodos que queremos alterar o ir agregando funcionalidad.

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

Ahora es momento de implementar el wrapper. La idea detras de este es que puede recibir el objeto objetivo y delegar las peticiones de este, pero ,este puede alterar el resultado haciendo algo después o antes de pasar esa petición. Si quisieramos compararlo con la vidad real podria ser con una hamburgueria. Primero tendriamos el proceso general que es tomar el pedido y entregarlo al cliente, el cliente pide una hamburguesa , una gaseosa, y le dice que de todas las cramas solo quiere mayonesa.

Como el proceso general sigue siendo el mismo, que es entregar el pedido todos estos procesos reciben el pedido como si fueran el cliente, pero agregan otro proceso, por ejemplo, salio la hamburguesa , la de las gaseosas tomo el pedio y le puso una gaseosa y la delega. El punto que quiero llegar es que si el cliente no hubiera agregado gaseseosa. Simplemente nos hubieramos ahorrado el proceso de agregar gasesoa.

Se que es un poco tonto el ejemplo. Pero fue lo único que se me ocurrio
