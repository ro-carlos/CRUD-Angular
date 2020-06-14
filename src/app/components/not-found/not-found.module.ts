import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NotFoundRoutingModule } from "./not-found-routing.module";
import { NotFoundComponent } from "./not-found.component";

const imports = [NotFoundRoutingModule, CommonModule];

@NgModule({
  declarations: [NotFoundComponent],
  imports,
})
export class NotFoundModule {}
