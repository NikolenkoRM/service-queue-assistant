import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  oAuthToken: string;
  user: any;
  constructor(private http: HttpClient, private router: Router) {}

  async auth() {
    this.oAuthToken = await this.getOAuthToken();
    const headers = new HttpHeaders().set('Authorization', `OAuth ${this.oAuthToken}`);
    const user = await this.http.get(`https://api.twitch.tv/kraken/user`, { headers }).toPromise();
    this.user = user;
    this.router.navigate(['']);
  }

  getOAuthToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const redirect = environment.production
        ? 'https://service-queue-assistant.web.app/auth'
        : 'http://localhost:4200/auth';
      const url = `https://id.twitch.tv/oauth2/authorize?client_id=${environment.twitchID}&redirect_uri=${redirect}&response_type=token&scope=channel_subscriptions+user_subscriptions+user_read`;

      const win = window.open(
        url,
        'twitchLoginNav',
        'location=yes,height=620,width=520,scrollbars=no,resizable=no,status=yes'
      );

      const interval = setInterval(() => {
        const responseToken = win.location.hash;
        if (responseToken) {
          clearInterval(interval);
          win.close();
          const token = responseToken.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
          resolve(token);
        }
      }, 1000);
    });
  }
}
