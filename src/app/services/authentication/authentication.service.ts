import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { from, Observable, Subject, throwError } from "rxjs";
import { first, map } from "rxjs/operators";
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
      this.snackBar.open("Successful login", "ok", {
        duration: 2000,
      });
    } catch (error) {
      this.snackBar.open("Your username or password is incorrect", "error", {
        duration: 2000,
      });
      this.handleError(error);
    }
  }

  async signup(username: string, email: string, password: string) {
    try {
      const response = await this.signUp(username, email, password).toPromise();
      await this.processLoginService(response, username);
      this.snackBar.open("Successful registration. Check your email", "ok", {
        duration: 2000,
      });
    } catch (error) {
      this.snackBar.open("Unexpected error", "error", {
        duration: 2000,
      });
      this.handleError(error);
    }
  }

  // logout(): Observable<any> {
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
  //       mergeMap(this.setUserIsLoggedOut),
  //       tap(this.redirectToLoginPage),
  //       catchError((error, caught) => caught)
  //     );
  // }

  logout(): Observable<any> {
    const observable = new Observable((subscriber) => {
      setTimeout(() => {
        this.setUserIsLoggedOut();
        this.redirectToLoginPage();
        subscriber.next();
        subscriber.complete();
      }, 0);
    });
    return observable;
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

  private logIn(username: string, password: string): Observable<any> {
    const content = [
      {
        id: 1,
        value: "Backend response",
      },
    ];
    const response = {
      content,
      number: 0,
      size: 20,
      totalElements: 20,
      totalPages: 1,
      status: 200,
    };

    const observable = new Observable((subscriber) => {
      setTimeout(() => {
        subscriber.next(response);
        subscriber.complete();
      }, 0);
    });

    return observable;
  }

  private signUp(
    username: string,
    email: string,
    password: string
  ): Observable<any> {
    const content = [
      {
        id: 1,
        value: "Backend response",
      },
    ];
    const response = {
      content,
      number: 0,
      size: 20,
      totalElements: 20,
      totalPages: 1,
      status: 200,
    };

    const observable = new Observable((subscriber) => {
      setTimeout(() => {
        subscriber.next(response);
        subscriber.complete();
      }, 0);
    });

    return observable;
  }

  private setUserIsLoggedOut = async () => {
    await Promise.all([this.storage.clear()]);
    this.loggedIn.next(false);
  };

  private redirectToLoginPage = () => {
    this.router.navigate(["login"]);
  };

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
