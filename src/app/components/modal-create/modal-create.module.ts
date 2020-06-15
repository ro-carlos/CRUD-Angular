import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatInputModule,
  MatSnackBarModule,
} from "@angular/material";
import { ModalCreateComponent } from "./modal-create.component";
const imports = [
  CommonModule,
  ReactiveFormsModule,
  MatButtonModule,
  MatDialogModule,
  MatDatepickerModule,
  MatInputModule,
  MatSnackBarModule,
];

@NgModule({
  declarations: [ModalCreateComponent],
  imports,
  entryComponents: [ModalCreateComponent],
})
export class ModalCreateModule {}
