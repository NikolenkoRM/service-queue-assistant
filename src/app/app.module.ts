import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QueuePanelComponent } from './components/queue-panel/queue-panel.component';
import { AngularFireModule } from '@angular/fire';
import { AuthComponent } from './components/auth/auth.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TwitchInterceptor } from './shared/twitch.interceptor';
import { StreamerPanelComponent } from './components/streamer-panel/streamer-panel.component';
import { AddInQueueDialogComponent } from './components/add-in-queue-dialog/add-in-queue-dialog.component';
import { QueueItemComponent } from './components/queue-item/queue-item.component';

@NgModule({
  declarations: [AppComponent, QueuePanelComponent, AuthComponent, StreamerPanelComponent, AddInQueueDialogComponent, QueueItemComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  entryComponents: [AddInQueueDialogComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TwitchInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
