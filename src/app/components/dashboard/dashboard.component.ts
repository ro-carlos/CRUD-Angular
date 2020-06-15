import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatTableDataSource } from "@angular/material";
import * as moment from "moment";
import { Subject, throwError } from "rxjs";
import { catchError, map, takeUntil } from "rxjs/operators";
import { BackendError } from "src/app/model/backend-error";
import { Item } from "src/app/model/item";
import { LocalCrudService } from "src/app/services/local-crud.service";
import Swal from "sweetalert2";
import { ModalCreateComponent } from "../modal-create/modal-create.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  min = new Date();
  max = new Date();

  dateForm: FormGroup = new FormGroup({
    startDate: new FormControl("", Validators.required),
    endDate: new FormControl("", Validators.required),
  });

  displayedColumns: string[] = [
    "id",
    "name",
    "website",
    "nationality",
    "birthday",
    "options",
  ];
  dataSource = new MatTableDataSource();

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog,
    private crudService: LocalCrudService
  ) {}

  ngOnInit() {
    this.getItems();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  minDateChange(e) {
    this.min = e.value;
  }

  maxDateChange(e) {
    this.max = e.value;
  }

  async findByDates() {
    const startDate = moment(this.dateForm.controls.startDate.value).format(
      "YYYY-MM-DD"
    );
    const endDate = moment(this.dateForm.controls.endDate.value).format(
      "YYYY-MM-DD"
    );
    const response = await this.crudService
      .filterByDates(startDate, endDate)
      .pipe(
        takeUntil(this.unsubscribe),
        map(this.detectBackendError),
        catchError(this.handleBackendError)
      )
      .toPromise();
    this.dataSource.data = [...response.content];
  }

  async filter(event) {
    const value = event.currentTarget.value;
    if (value === null || value === undefined || value === "") {
      this.getItems();
    } else {
      const response = await this.crudService
        .filter(value)
        .pipe(
          takeUntil(this.unsubscribe),
          map(this.detectBackendError),
          catchError(this.handleBackendError)
        )
        .toPromise();
      if (response && response.content && response.content.length > 0) {
        this.dataSource.data = [...response.content];
      } else {
        this.dataSource.data = [];
      }
    }
  }

  add() {
    const dialogRef = this.dialog.open(ModalCreateComponent, {
      data: { edit: false },
    });
    dialogRef.afterClosed().subscribe((item: Item) => {
      this.getItems();
    });
  }

  update(item: Item) {
    const dialogRef = this.dialog.open(ModalCreateComponent, {
      data: { edit: true, item },
    });
    dialogRef.afterClosed().subscribe((item: Item) => {
      this.getItems();
    });
  }

  async delete(id: string) {
    Swal.fire({
      title: "Are you sure you want to remove item?",
      icon: "question",
      cancelButtonText: "Cancel",
      customClass: { popup: "swal-height27" },
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Accept",
    }).then((result) => {
      if (result.value) {
        this.removeItem(id);
      }
    });
  }

  private async getItems() {
    const response = await this.crudService
      .list()
      .pipe(
        takeUntil(this.unsubscribe),
        map(this.detectBackendError),
        catchError(this.handleBackendError)
      )
      .toPromise();
    this.dataSource.data = [...response.content];
  }

  private async removeItem(id: string) {
    await this.crudService
      .removeItem(id)
      .pipe(
        takeUntil(this.unsubscribe),
        map(this.detectBackendError),
        catchError(this.handleBackendError)
      )
      .toPromise();
    Swal.fire({ title: "Item Deleted Successfully", icon: "success" });
    this.getItems();
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
