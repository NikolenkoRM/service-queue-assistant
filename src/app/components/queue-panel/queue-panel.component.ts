import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
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
  }

  addInQueue() {
    const dialog = this.dialog.open(AddInQueueDialogComponent);

    dialog.afterClosed().subscribe(async (data) => {
      if (data) {
        await this.queueService.addInQueue(data.text);
        this.snackbar.open('Заявка на сервис добавлена в очередь', null, { duration: 3000 });
      }
    });
  }
}
