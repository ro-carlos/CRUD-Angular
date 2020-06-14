import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthenticationGuard } from "./services/authentication/authentication.guard";
import { LoginGuard } from "./services/authentication/login.guard";

const routes: Routes = [
  {
    path: "login",
    loadChildren: "./components/login/login.module#LoginModule",
    canActivate: [LoginGuard],
  },
  {
    path: "dashboard",
    loadChildren: "./components/dashboard/dashboard.module#DashboardModule",
    canActivate: [AuthenticationGuard],
  },
  {
    path: "404",
    loadChildren: "./components/not-found/not-found.module#NotFoundModule",
  },
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  { path: "**", redirectTo: "/404" },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
