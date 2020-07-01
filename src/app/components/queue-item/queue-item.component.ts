import { Component, OnInit, Input } from '@angular/core';
import { QueueService } from 'src/app/services/queue.service';

@Component({
  selector: 'app-queue-item',
  templateUrl: './queue-item.component.html',
  styleUrls: ['./queue-item.component.scss'],
})
export class QueueItemComponent implements OnInit {
  @Input() n?: number;
  @Input() data: any;

  @Input() canRemove: boolean = false;

  constructor(private queueService: QueueService) {}

  ngOnInit(): void {}

  remove() {
    this.queueService.removeQueueItem(this.data.id);
  }
}
