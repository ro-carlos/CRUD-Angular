import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DateFieldModule } from "./date-field/date-field.module";
import { FieldComponent } from "./field.component";
import { TextFieldModule } from "./text-field/text-field.module";

const imports = [CommonModule, TextFieldModule, DateFieldModule];

@NgModule({
  declarations: [FieldComponent],
  imports,
  exports: [FieldComponent],
})
export class FieldModule {}
