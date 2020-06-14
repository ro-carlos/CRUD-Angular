import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { environment } from "./../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarModule } from "./components/shared/navbar/navbar.module";
import { XhrInterceptor } from "./services/security/XhrInterceptor";

@NgModule({
  declarations: [AppComponent],
  imports: [
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    RouterModule.forRoot([]),
    BrowserAnimationsModule,
    NavbarModule,
    MatSnackBarModule,
  ],
  providers: [
    XhrInterceptor,
    { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true },
    {
      provide: "backendUrl",
      useValue: environment.url,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
