import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  USERNAME_KEY = "username";
  displayLogoutButton = false;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authenticationService.loggedIn
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.displayLogoutButton = value;
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  logout() {
    this.authenticationService
      .logout()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.snackBar.open("Log out", "ok", {
          duration: 2000,
        });
      });
  }
}
