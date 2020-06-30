import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-in-queue-dialog',
  templateUrl: './add-in-queue-dialog.component.html',
  styleUrls: ['./add-in-queue-dialog.component.scss'],
})
export class AddInQueueDialogComponent implements OnInit {
  form: FormGroup;
  maxLength = 300;
  constructor(public dialogRef: MatDialogRef<AddInQueueDialogComponent>) {
    this.form = new FormGroup({
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
