import { Component, OnInit, Input } from '@angular/core';
import { TwitchService } from 'src/app/services/twitch.service';
import { QueueService } from 'src/app/services/queue.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-streamer-panel',
  templateUrl: './streamer-panel.component.html',
  styleUrls: ['./streamer-panel.component.scss'],
})
export class StreamerPanelComponent implements OnInit {
  streamer: any;
  channel: any;
  @Input() current: any;
  @Input() settings: any;

  settingsForm: FormGroup;
  constructor(
    private twitchService: TwitchService,
    private queueService: QueueService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.settingsForm = new FormGroup({
      onlyFollowers: new FormControl(this.settings.onlyFollowers),
      subsFirst: new FormControl(this.settings.subsFirst),
    });

    if (!this.checkStreamer()) {
      this.settingsForm.disable();
    }

    this.streamer = await this.twitchService.getStreamer();
    this.channel = await this.twitchService.getStreamerChannel();
  }

  toggleQueue() {
    this.queueService.setQueueStatus(!this.settings.status);
  }

  next() {
    this.queueService.nextService();
  }

  onSettingsChange() {
    this.queueService.saveSettings(this.settingsForm.value);
  }

  checkStreamer() {
    return (
      this.authService.user.display_name === environment.streamer || this.authService.user.display_name === 'FezioStill'
    );
  }
}
