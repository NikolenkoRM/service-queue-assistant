import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { QueueService } from 'src/app/services/queue.service';

@Component({
  selector: 'app-add-in-queue-dialog',
  templateUrl: './add-in-queue-dialog.component.html',
  styleUrls: ['./add-in-queue-dialog.component.scss'],
})
export class AddInQueueDialogComponent implements OnInit {
  form: FormGroup;
  maxLength = 100;
  constructor(public dialogRef: MatDialogRef<AddInQueueDialogComponent>, public queueService: QueueService) {
    this.form = new FormGroup({
      poeNick: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      text: new FormControl(null, [Validators.required, Validators.maxLength(this.maxLength)]),
    });
  }

  ngOnInit(): void {}

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
