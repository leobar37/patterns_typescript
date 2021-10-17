import { createDatabase, BaseRecord } from '../factory/factoryTow';
interface Chanel extends BaseRecord {
  name: string;
}

interface Subscriber<T> {
  update(event: T): void;
}

export type Notification = {
  nameVideo: string;
  channel: string;
  date?: Date;
};

type SubscriptionInfo = {
  id: string;
  channel: string;
};

class YoutubeSubscription implements Subscriber<Notification> {
  private sub: SubscriptionInfo;

  constructor(sub: SubscriptionInfo) {
    this.sub = sub;
  }
  getSub() {
    return this.sub;
  }
  update(event: Notification): void {
    console.log(
      ` (${event.date.toISOString()}) ${event.channel} uploaded a new video : ${
        event.nameVideo
      }`
    );
  }
}

class Youtube {
  suscriptions: Map<string, YoutubeSubscription[]> = new Map();

  channels = createDatabase<Chanel>({
    typeId: 'incremental'
  });

  constructor() {
    this.channels.insert({
      name: 'leobar'
    });
    this.channels.insert({
      name: 'nose'
    });
  }

  get getChannels() {
    return this.channels.findAll({});
  }
  notify(notify: Notification): void {
    this.suscriptions.get(notify.channel).forEach(d => d.update(notify));
  }

  suscribe(sub: YoutubeSubscription): void {
    if (this.channels.findAll({ name: sub.getSub().channel }).length == 0) {
      throw new Error('This channel does not exist');
    }
    let subs: YoutubeSubscription[] = [];
    if (this.suscriptions.has(sub.getSub().channel)) {
      subs = this.suscriptions.get(sub.getSub().channel);
    }
    subs.push(sub);
    this.suscriptions.set(sub.getSub().channel, subs);
  }
  unsuscribe(sub: YoutubeSubscription): void {
    let channelSubs = this.suscriptions.get(sub.getSub().channel);
    if (channelSubs) {
      channelSubs = channelSubs.filter(sub => sub !== sub);
      this.suscriptions.set(sub.getSub().channel, channelSubs);
      console.log(`${sub.getSub().id} Unsuscribed`);
      console.log('Suscribers :' + channelSubs.length);
      console.log(channelSubs);
    }
  }
}

const youtube = new Youtube();

const leobarSub = new YoutubeSubscription({
  channel: 'leobar',
  id: '1'
});

const noseSubscription = new YoutubeSubscription({
  channel: 'nose',
  id: '2'
});

youtube.suscribe(leobarSub);

youtube.suscribe(noseSubscription);

let cont = 0;

const channels = youtube.getChannels.map(d => d.name);

setInterval(() => {
  const ramdom = Math.floor(Math.random() * channels.length);
  youtube.notify({
    channel: channels[ramdom],
    nameVideo: 'video nro:' + cont,
    date: new Date()
  });
  if (cont === 5) {
    youtube.unsuscribe(leobarSub);
  }
  if (cont == 8) {
    youtube.unsuscribe(noseSubscription);
  }
  cont++;
}, 2000);
