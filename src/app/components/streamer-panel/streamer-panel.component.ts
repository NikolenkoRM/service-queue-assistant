import { Component, OnInit, Input } from '@angular/core';
import { TwitchService } from 'src/app/services/twitch.service';
import { QueueService } from 'src/app/services/queue.service';

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
  constructor(private twitchService: TwitchService, private queueService: QueueService) {}

  async ngOnInit() {
    this.streamer = await this.twitchService.getStreamer();
    this.channel = await this.twitchService.getStreamerChannel();
  }

  toggleQueue() {
    this.queueService.setQueueStatus(!this.settings.status);
  }

  next() {
    this.queueService.nextService();
  }
}
