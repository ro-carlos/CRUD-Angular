import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DateFieldComponent } from "./date-field.component";

const imports = [CommonModule];

@NgModule({
  declarations: [DateFieldComponent],
  imports,
})
export class DateFieldModule {}
