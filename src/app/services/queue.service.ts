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
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private twitchService: TwitchService
  ) {
    this.getQueueSettings().subscribe((data) => {
      this.settings = data;
    });

    this.getQueue().subscribe((data: any) => {
      this.queue = data;
    });

    this.getCurrentService().subscribe((data) => {
      this.current = data;
    });
  }

  async addInQueue(serviceText: string) {
    if (await this.twitchService.checkFollow()) {
      const id = this.firestore.createId();
      const sub = await this.twitchService.checkSub();
      return this.firestore.collection('queue').doc(id).set({
        name: this.authService.user.display_name,
        avatar: this.authService.user.logo,
        text: serviceText,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        sub: !sub.error,
        id,
      });
    }
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
      await this.firestore.collection('current').doc('current').set(nextService);
      await this.firestore.collection('queue').doc(nextService.id).delete();
    }

    return;
  }
}
