import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from "./navbar.component";

const imports = [MatToolbarModule, CommonModule, RouterModule];

@NgModule({
  declarations: [NavbarComponent],
  imports,
  exports: [NavbarComponent],
})
export class NavbarModule {}
