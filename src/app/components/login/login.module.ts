import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTabsModule,
} from "@angular/material";
import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login.component";
const imports = [
  LoginRoutingModule,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatInputModule,
  MatCardModule,
  MatTabsModule,
  MatFormFieldModule,
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
];

@NgModule({
  declarations: [LoginComponent],
  imports,
})
export class LoginModule {}
