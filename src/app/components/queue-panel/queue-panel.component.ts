import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';
import { TwitchService } from 'src/app/services/twitch.service';
import { QueueService } from 'src/app/services/queue.service';
import { MatDialog } from '@angular/material/dialog';
import { AddInQueueDialogComponent } from '../add-in-queue-dialog/add-in-queue-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-queue-panel',
  templateUrl: './queue-panel.component.html',
  styleUrls: ['./queue-panel.component.scss'],
})
export class QueuePanelComponent implements OnInit {
  queue: Observable<any[]>;
  environment = environment;

  constructor(
    public authService: AuthService,
    public queueService: QueueService,
    private twitchService: TwitchService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.authService.user) {
      this.router.navigate(['/auth']);
      return;
    }

    this.twitchService.getStreamer();
    this.queueService.calculateAvgTime();
  }

  async addInQueue() {
    const reasons = await this.queueService.checkCanReg();
    if (reasons.length) {
      this.snackbar.open(reasons.join(' '), null, { duration: 3000 });
      return;
    }

    const dialog = this.dialog.open(AddInQueueDialogComponent);

    dialog.afterClosed().subscribe(async (data) => {
      if (data) {
        const res = await this.queueService.addInQueue(data.poeNick, data.text);
        if (res) {
          this.snackbar.open('Заявка на сервис добавлена в очередь', null, { duration: 3000 });
        }
      }
    });
  }
}
