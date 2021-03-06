import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { TwitchService } from './twitch.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  settings: any;
  queue: any;
  current: any;
  avgDuration: number = 0;
  queueDuration: number = 0;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private twitchService: TwitchService
  ) {
    this.getQueueSettings().subscribe((data) => {
      this.settings = data;
      this.sortQueue();
    });

    this.getQueue().subscribe((data: any) => {
      this.queue = data;
      this.sortQueue();
      this.calculateQueueDuration();
    });

    this.getCurrentService().subscribe((data) => {
      this.current = data;
    });

    this.calculateAvgTime().subscribe((data) => {
      let totalDuration = 0;
      data.forEach((item: any) => {
        if (item.ended && item.created) {
          totalDuration += item.ended.seconds - item.created.seconds;
        }
      });

      const avgDuration = totalDuration / data.length / 60;
      this.avgDuration = avgDuration;
      this.calculateQueueDuration();
    });
  }

  async addInQueue(poeNick: string, serviceText: string) {
    if ((await this.checkCanReg()).length) {
      return false;
    }

    const id = this.firestore.createId();
    const sub = await this.twitchService.checkSub();

    await this.firestore.collection('queue').doc(id).set({
      twitchNick: this.authService.user.display_name,
      poeNick: poeNick.trim(),
      avatar: this.authService.user.logo,
      text: serviceText.trim(),
      created: firebase.firestore.FieldValue.serverTimestamp(),
      sub,
      id,
    });

    return true;
  }

  getQueueSettings() {
    return this.firestore.collection('settings').doc('queue').valueChanges();
  }

  setQueueStatus(status: boolean) {
    return this.firestore.collection('settings').doc('queue').update({ status });
  }

  getQueue() {
    return this.firestore.collection('queue', (ref) => ref.orderBy('created', 'asc')).valueChanges();
  }

  getCurrentService() {
    return this.firestore.collection('current').doc('current').valueChanges();
  }

  async nextService() {
    if (this.current) {
      const ended = firebase.firestore.FieldValue.serverTimestamp();

      await this.firestore
        .collection('history')
        .doc(this.current.id)
        .set({ ...this.current, ended });

      await this.firestore.collection('current').doc('current').delete();
    }

    const nextService = this.queue[0];
    if (nextService) {
      this.firestore.collection('current').doc('current').set(nextService);
      await this.removeQueueItem(nextService.id);
    }

    return;
  }

  removeQueueItem(id: string) {
    return this.firestore.collection('queue').doc(id).delete();
  }

  sortQueue() {
    if (!this.queue) {
      return;
    }

    this.queue = this.queue.sort((a, b) => {
      return a.created?.seconds - b.created?.seconds;
    });

    if (this.settings.subsFirst) {
      this.queue = this.queue
        .sort((a: any, b: any) => {
          return +(a.sub > b.sub) - 1;
        })
        .reverse();
    }
  }

  saveSettings(settings: any) {
    return this.firestore.collection('settings').doc('queue').update(settings);
  }

  async checkCanReg(): Promise<string[]> {
    const reasons = [];
    if (!this.settings.status) {
      reasons.push('Запись в очередь остановлена');
    }

    if (this.settings.onlyFollowers && !(await this.twitchService.checkFollow())) {
      reasons.push('Необходимо быть зафолловленным на канал');
    }

    if (this.settings.maxLength && this.queue?.length >= this.settings.maxLength) {
      reasons.push('Превышен лимит записей на сервис');
    }

    if (this.settings.maxDuration && this.queueDuration >= this.settings.maxDuration) {
      reasons.push('Превышен лимит записей на сервис');
    }

    return reasons;
  }

  calculateAvgTime() {
    return this.firestore.collection('history', (ref) => ref.limit(10)).valueChanges();
  }

  calculateQueueDuration() {
    if (this.avgDuration) {
      this.queueDuration = this.queue?.length * this.avgDuration;
    }
  }
}
