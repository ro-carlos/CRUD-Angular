import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";

const imports = [DashboardRoutingModule, CommonModule];

@NgModule({
  declarations: [DashboardComponent],
  imports,
})
export class DashboardModule {}
