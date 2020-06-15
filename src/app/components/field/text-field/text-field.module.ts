import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule, MatInputModule } from "@angular/material";
import { TextFieldComponent } from "./text-field.component";

const imports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatInputModule,
  MatFormFieldModule,
];

@NgModule({
  declarations: [TextFieldComponent],
  imports,
  exports: [TextFieldComponent],
})
export class TextFieldModule {}
