import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { from, Observable, Subject, throwError } from "rxjs";
import { catchError, first, map, mergeMap, tap } from "rxjs/operators";
import { StorageService } from "../security/storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService implements OnDestroy {
  USERNAME_KEY = "username";
  TOKEN_KEY = "Token";

  headers = new HttpHeaders({});

  loggedIn = new Subject<void>();
  loggedIn$ = this.loggedIn.asObservable();

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router,
    @Inject("backendUrl") private backendUrl: string
  ) {}

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  isLoggedIn() {
    return from(this.storage.get(this.USERNAME_KEY)).pipe(
      first(),
      map((userName) => {
        return userName !== null && userName !== undefined;
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
    } catch (error) {
      this.handleError(error);
    }
  }

  logout(): Observable<any> {
    const url = this.backendUrl + "login";

    return this.http
      .get(url, {
        withCredentials: true,
        observe: "response",
      })
      .pipe(
        map((response) => {
          return true;
        }),
        mergeMap(this.setUserIsLoggedOut),
        tap(this.redirectToLoginPage),
        catchError((error, caught) => caught)
      );
  }

  async processLoginService(response, username) {
    if (response.status !== 200) {
      throw new LoginError("Error in login.", response.status);
    }
    await sessionStorage.setItem("USER", username);

    await this.storage.set(
      this.TOKEN_KEY,
      response.headers.get("Authorization")
    );
  }

  private logIn(username: string, pwd: string): Observable<any> {
    const url = this.backendUrl + "login";
    const headers = new HttpHeaders({}).set("Content-Type", "application/json");
    const userLogin = {
      email: username,
      password: pwd,
    };
    const body = JSON.stringify(userLogin);
    return this.http.post(url, body, {
      withCredentials: true,
      headers,
      observe: "response",
    });
  }

  private setUserIsLoggedOut = async (val = true) => {
    await Promise.all([this.storage.clear()]);
    return val;
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
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}
