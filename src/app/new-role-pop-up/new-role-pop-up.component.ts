import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { ColorEvent } from 'ngx-color';

export interface DialogData {
  name: string,
  color: string
}

@Component({
  selector: 'app-new-role-pop-up',
  templateUrl: './new-role-pop-up.component.html',
  styleUrls: ['./new-role-pop-up.component.css']
})
export class NewRolePopUpComponent implements OnInit {
  name: string;
  color: string;
  roleForm: FormGroup;

  constructor(
    fb: FormBuilder,
    public dialogRef: MatDialogRef<NewRolePopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.name = data.name;
      this.color = data.color;
      this.roleForm = fb.group({
        name: [this.name, [Validators.required, Validators.maxLength(15)]],
        color: this.color
      });
     }

    handleChange($event: ColorEvent) {
      this.roleForm.patchValue({color: $event.color.hex});
     }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
