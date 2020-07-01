import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TwitchService {
  streamer: any;
  channel: any;
  sub: any;
  follow: any;
  constructor(private http: HttpClient, private authService: AuthService) {}

  async getStreamer() {
    if (!this.streamer) {
      const res: any = await this.http
        .get(`https://api.twitch.tv/kraken/users/?login=${environment.streamer}`)
        .toPromise();
      this.streamer = res?.users[0];
    }

    return this.streamer;
  }

  async getStreamerChannel() {
    if (!this.channel) {
      if (!this.streamer) {
        await this.getStreamer();
      }

      const res = await this.http.get(`https://api.twitch.tv/kraken/channels/${this.streamer._id}`).toPromise();
      this.channel = res;
    }

    return this.channel;
  }

  checkSub(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (this.sub === undefined) {
        try {
          const streamerChannel = await this.getStreamerChannel();
          const headers = new HttpHeaders().set('Authorization', `OAuth ${this.authService.oAuthToken}`);
          const sub = await this.http
            .get(
              `https://api.twitch.tv/kraken/users/${this.authService.user._id}/subscriptions/${streamerChannel._id}`,
              {
                headers,
              }
            )
            .toPromise();

          this.sub = true;
        } catch (error) {
          this.sub = false;
        }
      }

      resolve(this.sub);
    });
  }

  checkFollow() {
    return new Promise(async (resolve) => {
      if (this.follow === undefined) {
        try {
          const streamerChannel = await this.getStreamerChannel();
          const follow = await this.http
            .get(
              `https://api.twitch.tv/kraken/users/${this.authService.user._id}/follows/channels/${streamerChannel._id}`
            )
            .toPromise();

          this.follow = true;
        } catch (error) {
          this.follow = false;
        }
      }

      resolve(this.follow);
    });
  }
}
