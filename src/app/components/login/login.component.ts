import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  signInForm = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signUpForm = this.formBuilder.group(
      {
        username: new FormControl("", [Validators.required]),
        email: new FormControl("", [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/),
        ]),
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(6),
        ]),
        repassword: new FormControl(),
      },
      {
        validators: this.checkPasswords.bind(this),
      }
    );
  }

  signIn() {
    const username = this.signInForm.value["email"];
    const password = this.signInForm.value["password"];
    this.authenticationService.login(username, password).then((response) => {
      this.router.navigate([""], { replaceUrl: true });
    });
  }

  signUp() {
    const username = this.signUpForm.value["username"];
    const email = this.signUpForm.value["email"];
    const password = this.signUpForm.value["password"];
    this.authenticationService
      .signup(username, email, password)
      .then((response) => {
        this.router.navigate([""], { replaceUrl: true });
      });
  }

  private checkPasswords(formGroup: FormGroup) {
    const { value: password } = formGroup.get("password");
    const { value: repassword } = formGroup.get("repassword");
    const matched: boolean = password === repassword;

    if (this.signUpForm && matched) {
      this.signUpForm.get("repassword").setErrors(null);
    } else if (this.signUpForm) {
      this.signUpForm.get("repassword").setErrors({
        notMatched: true,
      });
    }

    return matched;
  }
}
