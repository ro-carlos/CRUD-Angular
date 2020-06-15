import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { from, Observable, Subject, throwError } from "rxjs";
import { first, map } from "rxjs/operators";
import { BackendResponse } from "src/app/model/response";
import Swal from "sweetalert2";
import { StorageService } from "../security/storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService implements OnDestroy {
  USERNAME_KEY = "username";
  TOKEN_KEY = "Token";

  headers = new HttpHeaders({});

  loggedIn = new Subject<boolean>();

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router,
    @Inject("backendUrl") private backendUrl: string,
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  isLoggedIn() {
    return from(this.storage.get(this.USERNAME_KEY)).pipe(
      first(),
      map((userName) => {
        const status = userName !== null && userName !== undefined;
        this.loggedIn.next(status);
        return status;
      })
    );
  }

  getToken(): Observable<any> {
    return from(this.storage.get(this.TOKEN_KEY));
  }

  async login(username: string, password: string) {
    try {
      const response = await this.logIn(username, password).toPromise();
      await this.processLoginService(response, username);
      this.snackBar.open("Login", "ok", {
        duration: 2000,
      });
    } catch (error) {
      Swal.fire({
        title: "Your Username or Password is incorrect",
        icon: "error",
      });
      this.handleError(error);
    }
  }

  async signup(username: string, email: string, password: string) {
    try {
      const response = await this.signUp(username, email, password).toPromise();
      await this.processLoginService(response, email);
      Swal.fire({
        title: "Successful Registration. Check yor Email",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({ title: "Unexpected Error", icon: "error" });
      this.handleError(error);
    }
  }

  async logout() {
    try {
      const response = await this.logOut().toPromise();
      await this.setUserIsLoggedOut(response);
      this.snackBar.open("Logout", "ok", {
        duration: 2000,
      });
    } catch (error) {
      Swal.fire({ title: "Unexpected Error", icon: "error" });
      this.handleError(error);
    }
  }

  async processLoginService(response, username) {
    if (response.status !== 200) {
      throw new LoginError("Error in login.", response.status);
    }
    await sessionStorage.setItem(this.USERNAME_KEY, username);
    this.loggedIn.next(true);

    await this.storage.set(
      this.TOKEN_KEY,
      "AUTHORIZATION_TOKEN_123"
      // response.headers.get("Authorization")
    );
  }

  // private logIn(username: string, password: string): Observable<any> {
  //   const url = this.backendUrl + "login";
  //   const headers = new HttpHeaders({}).set("Content-Type", "application/json");
  //   const userLogin = {
  //     email: username,
  //     password,
  //   };
  //   const body = JSON.stringify(userLogin);
  //   return this.http.post(url, body, {
  //     withCredentials: true,
  //     headers,
  //     observe: "response",
  //   });
  // }

  // private signUp(
  //   username: string,
  //   email: string,
  //   password: string
  // ): Observable<any> {
  //   const url = this.backendUrl + "signUp";
  //   const headers = new HttpHeaders({}).set("Content-Type", "application/json");
  //   const userLogin = {
  //     username,
  //     email,
  //     password,
  //   };
  //   const body = JSON.stringify(userLogin);
  //   return this.http.post(url, body, {
  //     withCredentials: true,
  //     headers,
  //     observe: "response",
  //   });
  // }

  // logOut(): Observable<any> {
  //   const url = this.backendUrl + "logout";

  //   return this.http
  //     .get(url, {
  //       withCredentials: true,
  //       observe: "response",
  //     })
  //     .pipe(
  //       map((response) => {
  //         return true;
  //       }),
  //       tap(this.redirectToLoginPage),
  //       catchError((error, caught) => caught)
  //     );
  // }

  private logIn(
    username: string,
    password: string
  ): Observable<BackendResponse> {
    const content = [
      {
        id: 1,
        value: "Backend response",
      },
    ];
    const response = new BackendResponse(content, 0, 20, 20, 1, 200);

    return new Observable((subscriber) => {
      setTimeout(() => {
        subscriber.next(response);
        subscriber.complete();
      }, 0);
    });
  }

  private signUp(
    username: string,
    email: string,
    password: string
  ): Observable<BackendResponse> {
    const content = [
      {
        id: 1,
        value: "Backend response",
      },
    ];
    const response = new BackendResponse(content, 0, 20, 20, 1, 200);

    return new Observable((subscriber) => {
      setTimeout(() => {
        subscriber.next(response);
        subscriber.complete();
      }, 0);
    });
  }

  private logOut(): Observable<BackendResponse> {
    const response = new BackendResponse([], 0, 0, 0, 1, 200);
    return new Observable((subscriber) => {
      setTimeout(() => {
        subscriber.next(response);
        subscriber.complete();
      }, 0);
    });
  }

  private async setUserIsLoggedOut(response) {
    if (response.status !== 200) {
      throw new LoginError("Error in logout.", response.status);
    }
    await Promise.all([this.storage.clear()]);
    this.loggedIn.next(false);
  }

  private handleError = (error: LoginError) => {
    let devMessage = "";
    let userMessage = "";

    return throwError(devMessage);
  };
}

export class LoginError extends Error {
  constructor(
    public message: string,
    public shouldDisplay = true,
    public status?: number
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
