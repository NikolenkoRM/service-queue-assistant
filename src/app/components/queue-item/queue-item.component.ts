import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-queue-item',
  templateUrl: './queue-item.component.html',
  styleUrls: ['./queue-item.component.scss'],
})
export class QueueItemComponent implements OnInit {
  @Input() n?: number;
  @Input() name: string;
  @Input() avatar: string;
  @Input() text: string;
  @Input() created: Date;
  constructor() {}

  ngOnInit(): void {}
}
