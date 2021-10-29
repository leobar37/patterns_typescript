# Decoradores en typescript 

Hola en este post vamos quier enseñar un sobre los decoradores, pero especificamente en typescript, ya habia hablado sobre el patrón en decorador en si y cual es su beneficio.

En frameworks como Angular o Nestjs se ve a cada momento los decoradores, para definir componentes, servicios , controladores etc y todo esto hace que todo esto sea como magico, pero la gran verdad es que detrás de una simple anotación puede estar escondida mucha logica de por medio. Es un poco curioso por que esto es un caracteristica experimental en Typescript y  esta como una propuesta en javascript. 

En typescript un decorador es un tipo especial de declaración que puede ser aplicado a clases , metodos , propiedades y parametros y es llamada en tiempo de ejecución con información acerca de la declaración decorada.

En este post se va hablar de 3 tipos de decorador:

- Class
- Property
- Method


## Decorador de clase


Este decorado es llamado cuando la clase es declarada y es posible interceptar al clase y hacer algo con ella.

Por ejemplo; podemos agregar propiedades y metodos a la clase.



```ts
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
```

La función print es un decorador el cual debe ser llamando con la siguiente anotoación `@decorator`.

Todas los decoradores de clase van a  recibir como parametro la clase sobre el cual se esta aplicando el decorador para poder hacer algo con ella en este caso , estamos extendiendo esta clase , agregando el metodo `print`.

```ts
interface Person {
  print(): void;
}

@print
class Person {
  name = 'leo';
  age = 10;
  constructor() {}
}

const person = new Person();

person.print();
/**
name : leo
age : 10
printVersion : 1
 */

```

La razón por la cual hay existe la interfaz `Person` es por que los decoradores pueden agregar funciones pero no pueden comunicar el tipado
de lo  que se aplica. Pero en typescript existe combinación de declaraciones 
lo cual permite combinar dos o mas declaraciones con el mismo nombre.

Pero un decorador nos permite agregar funcionalidades dinamicamente y aqui no se esta viendo muy bien eso.

```ts
function noise(target: any) {
  return class extends target {
    constructor(...args: any[]) {
      console.log('Hello friend I am instantiating');
      super(args);
      console.log('i am already instantiated');
    }
  } as any;
}
```


El decorador `noise` modifica el constructor de la clase objetivo agregando un mensaje antes y después.


```ts
@noise
@print
class Person {
  name = 'leo';
  age = 10;
  constructor() {
    console.log(':o');
  }
}

const person = new Person();

person.print();

/*
Hello friend I am instantiating
:o
i am already instantiated
name : leo
age : 10
printVersion : 1
*/
```

## Decorador de propiedades

Asi como podemos interceptar las clases , tambien podemos interceptar las propiedades.

Para que una funciòn pueda ser utilizado como decorador de propiedad, tiene que recibir dos argumentos la clase y el nombre de la propiedad. 

```ts
function propertyDecorator(target: any, key: string | Symbol) {
  
}

```
Veamos un ejemplo sencillo:

```ts
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
    configurable: true,
    set: setter,
    get: getter
  });
}

```

Este decorador tiene como función de convertir en mayùscula el valor de la propiedad a la cual es aplicado. Pero tambien se puede notar algo nuevo `Object.defineProperty` , el cual nos permite definir la descripción de una propidad,puedes leer mas de esto [aquí](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor).


Veamos un pequeño resumen de las propiedades que utilice.


**ennumerable:** Permite que esta propiedad sea visible en la enumeración de las propiedades, Es decir si es false no aparecera cuando se utilice `Object.keys` o `For .. in` por ejemplo. 

**configurable:**
Si es `true` , el descriptor de esta propiedad puede ser modificado.


**get:** 
Retorna el valor de la propiedad.

**set:**

Es invocado al agregar el valor a la propiedad.













