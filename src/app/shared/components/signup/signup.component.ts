import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { UserService } from "app/shared/services/user.service";
import { User } from "app/models/user.interface";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  failed: boolean;
  passwordsMatch: boolean;
  user: User;

  constructor(private formBuilder: FormBuilder, private userService: UserService) { 
    this.userService.user$.subscribe((userData) => {this.user = userData;});
  }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.minLength(8)],
      passwordConfirm: [null]
    });
  }

  onSubmit() {
    if (this.signupForm.valid && this.signupForm.value.password ===
      this.signupForm.value.passwordConfirm) {
      // call the user service user method
      this.userService.create({ email: this.signupForm.value.email, password: this.signupForm.value.password });
    } else {
      this.passwordsMatch = this.signupForm.value.password ===
        this.signupForm.value.passwordConfirm;
      this.failed = true;
    }
  }

}
