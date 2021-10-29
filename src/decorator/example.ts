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

class DeliverHamburguer implements ICustomerService {
  receiveOrder(detail: Detail): void {
    console.log('details');
    console.log(detail);
  }
  deliverOder(): Order {
    return ['A hamburguer'];
  }
}

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
