import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { Item } from "src/app/model/item";

@Component({
  selector: "app-modal-create",
  templateUrl: "./modal-create.component.html",
  styleUrls: ["./modal-create.component.scss"],
})
export class ModalCreateComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl("", Validators.required),
    website: new FormControl("", Validators.required),
    nationality: new FormControl("", Validators.required),
    birthday: new FormControl("", Validators.required),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<any>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.data.edit) {
      const date = new Date(this.data.item.birthday);
      this.form.controls.name.setValue(this.data.item.name);
      this.form.controls.website.setValue(this.data.item.website);
      this.form.controls.nationality.setValue(this.data.item.nationality);
      this.form.controls.birthday.setValue(date.toISOString());
    }
  }

  crearEquipo() {
    const item = new Item(
      "",
      this.form.controls.name.value,
      this.form.controls.nationality.value,
      this.form.controls.birthday.value.format("YYYY-MM-DD"),
      this.form.controls.website.value
    );
    if (this.form.valid) {
      if (this.data.edit) {
        console.log("Edit");
      } else {
        console.log("Create");
      }
    }
  }
}
