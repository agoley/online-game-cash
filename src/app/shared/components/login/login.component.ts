import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { UserService } from "app/shared/services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  failed: boolean;

  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.minLength(8)]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // call the user service user method
      this.userService.authenticate(this.loginForm.value);
    } else {
      this.failed = true;
    }
  }

}
