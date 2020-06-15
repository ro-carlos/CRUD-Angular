import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import * as moment from "moment";
import { Subject, throwError } from "rxjs";
import { catchError, map, takeUntil } from "rxjs/operators";
import { BackendError } from "src/app/model/backend-error";
import { Item } from "src/app/model/item";
import { LocalCrudService } from "src/app/services/local-crud.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-modal-create",
  templateUrl: "./modal-create.component.html",
  styleUrls: ["./modal-create.component.scss"],
})
export class ModalCreateComponent implements OnInit {
  itemId: string;
  form = new FormGroup({
    name: new FormControl("", Validators.required),
    website: new FormControl("", Validators.required),
    nationality: new FormControl("", Validators.required),
    birthday: new FormControl("", Validators.required),
  });

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<any>,
    private snackBar: MatSnackBar,
    private crudService: LocalCrudService
  ) {}

  ngOnInit() {
    if (this.data.edit) {
      // const date = new Date(this.data.item.birthday);
      this.form.controls.name.setValue(this.data.item.name);
      this.form.controls.website.setValue(this.data.item.website);
      this.form.controls.nationality.setValue(this.data.item.nationality);
      this.form.controls.birthday.setValue(
        moment(this.data.item.birthday).toDate()
      );
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  async createItem() {
    const date = new Date(this.form.controls.birthday.value);
    const dd = date.getDate().toString().padStart(2, "0");
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = date.getFullYear().toString().padStart(4, "0");
    const dateFormat = yyyy + "-" + mm + "-" + dd;

    const id = this.data.item && this.data.item.id ? this.data.item.id : null;

    const item = new Item(
      id,
      this.form.controls.name.value,
      this.form.controls.nationality.value,
      this.form.controls.website.value,
      moment(this.form.controls.birthday.value).format("YYYY-MM-DD")
    );
    if (this.form.valid) {
      if (this.data.edit) {
        await this.crudService
          .updateItem(item)
          .pipe(
            takeUntil(this.unsubscribe),
            map(this.detectBackendError),
            catchError(this.handleBackendError)
          )
          .toPromise();

        this.dialog.close();
        Swal.fire({ title: "Item Edited Successfully", icon: "success" });
      } else {
        await this.crudService
          .createItem(item)
          .pipe(
            takeUntil(this.unsubscribe),
            map(this.detectBackendError),
            catchError(this.handleBackendError)
          )
          .toPromise();

        this.dialog.close();
        Swal.fire({ title: "Item Created Successfully", icon: "success" });
      }
    }
  }

  private detectBackendError = (response) => {
    if (response && response.backendError) {
      console.error("RESPONSE:", response);
      const error: BackendError = response;
      throw error;
    }
    return response;
  };

  private handleBackendError = (error: BackendError) => {
    const errorCode = error.errorCode ? error.errorCode : "001";
    Swal.fire({ title: "Unexpected Error", icon: "question" });
    return throwError(error);
  };
}
