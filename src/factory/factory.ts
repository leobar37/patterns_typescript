// function firstExample() {
//   type Callback = (label: string) => void;
//   abstract class Button {
//     label: string;
//     abstract render(): void;
//     onClick(callback: Callback) {
//       console.log('Click here');
//       callback(this.label);
//     }
//   }

//   class WindowsButton extends Button {
//     label = 'Windows';
//     render() {
//       console.log('Windows button');
//     }
//   }

//   class LinuxButton extends Button {
//     label = 'Linux';
//     render() {
//       console.log('Linux button');
//     }
//   }

//   abstract class Dialog {
//     protected abstract createButton(): Button;
//     render() {
//       let button = this.createButton();
//       setTimeout(() => {
//         button.onClick(label => {
//           console.log('click buton', label);
//         });
//       }, 2000);
//     }
//   }

//   class WindowsDialog extends Dialog {
//     createButton(): Button {
//       return new WindowsButton();
//     }
//   }

//   class LinuxDialog extends Dialog {
//     createButton(): Button {
//       return new LinuxButton();
//     }
//   }

//   const OS: string = 'Windows';

//   function createDialog(): Dialog {
//     if (OS === 'linux') {
//       return new LinuxDialog();
//     } else {
//       return new WindowsDialog();
//     }
//   }

//   const dialog = createDialog();

//   dialog.render();
// }

abstract class Message {
  id: string;
  send(): void {
    console.log('send message type : ' + this.id);
  }
}

class TextMessage extends Message {
  id = 'Text';
}

class ImageMessage extends Message {
  id = 'Image';
}

class ButtonMessage extends Message {
  id = 'Button';
}

class GaleryMessage extends Message {
  id = 'Galery';
}
enum TypeMessage {
  TEXT,
  IMAGE,
  GALERY,
  BUTTON
}

function createMessage(type: TypeMessage) {
  switch (type) {
    case TypeMessage.TEXT:
      return new TextMessage();
    case TypeMessage.BUTTON:
      return new ButtonMessage();
    case TypeMessage.IMAGE:
      return new ImageMessage();
    case TypeMessage.GALERY:
      return new GaleryMessage();
  }
}

const btnMessage = createMessage(TypeMessage.BUTTON);
btnMessage.send();
const textMessage = createMessage(TypeMessage.TEXT);
textMessage.send();
