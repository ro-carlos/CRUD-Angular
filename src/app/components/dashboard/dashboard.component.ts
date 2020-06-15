import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { Item } from "src/app/model/item";
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

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource.data = [
      {
        id: "1",
        name: "Carlos",
        website: "www.google.com",
        nationality: "Colombian",
        birthday: "1996-12-25",
      },
      {
        id: "2",
        name: "Alejandro",
        website: "www.google.com",
        nationality: "Colombian",
        birthday: "1998-04-28",
      },
    ];
  }

  minDateChange(e) {
    this.min = e.value;
  }

  maxDateChange(e) {
    this.max = e.value;
  }

  findByDates() {
    console.log("Find by dates");
  }

  filterById(id: string) {
    console.log("Filter by id: ", id);
  }

  add() {
    const dialogRef = this.dialog.open(ModalCreateComponent, {
      data: { edit: false },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("Add");
    });
  }

  update(item: Item) {
    const dialogRef = this.dialog.open(ModalCreateComponent, {
      data: { edit: true, item },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("Update");
    });
  }

  delete(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "Accepting, you will delete item",
      icon: "question",
      cancelButtonText: "Cancel",
      customClass: { popup: "swal-height27" },
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Accept",
    }).then((result) => {
      if (result.value) {
        console.log("Delete item");
      }
    });
  }
}
