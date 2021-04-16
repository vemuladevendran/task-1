import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

const confimrPasswordValidator = (c1: string, c2: string): ValidatorFn => {
  return (passwordValue: AbstractControl): null | ValidationErrors => {
    if (passwordValue.get(c1)?.value !== passwordValue.get(c2)?.value) {
      return {
        passwordMismatch: 'Password mismatcgh',
      };
    }

    return null;
  };
};


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

  newUserForm: FormGroup;
  passwordHide = true;
  confirmPasswordHide = true;
  constructor(
    private fb: FormBuilder,

  ) {
    this.newUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: confimrPasswordValidator('password', 'confirmPassword'),
    });
  }

  ngOnInit(): void {
  }

}
