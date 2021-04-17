import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';

const confimrPasswordValidator = (c1: string, c2: string): ValidatorFn => {
  return (passwordValue: AbstractControl): null | ValidationErrors => {
    if (passwordValue.get(c1)?.value !== passwordValue.get(c2)?.value) {
      passwordValue.get(c2)?.setErrors({ passwordMismatch: true });
      return {
        passwordMismatch: 'Password mismatcgh',
      };
    }

    if (passwordValue.get(c2)?.errors) {
      const { passwordMismatch, ...errors } = passwordValue.get(c2)?.errors || {};
      passwordValue.get(c2)?.setErrors(Object.keys(errors).length === 0 ? null : errors);
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

  @ViewChild(FormGroupDirective) myf: FormGroupDirective | undefined;

  newUserForm: FormGroup | undefined;
  passwordHide = true;
  confirmPasswordHide = true;
  isSubmited = false;
  userCreatedSuccessfull = false;
  userAlreadyExists = false;
  constructor(
    private fb: FormBuilder,
    private userServe: UserService

  ) {
    this.initForm();
  }

  private initForm(): void {
    this.newUserForm = this.fb.group({
      firstName: ['dev', Validators.required],
      lastName: ['v', Validators.required],
      userName: ['deva', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      dob: ['2002-08-27'],
      gender: [''],
    }, {
      validators: confimrPasswordValidator('password', 'confirmPassword'),
    });
  }

  ngOnInit(): void {
  }

  async createUser(): Promise<void> {
    try {
      this.isSubmited = true;
      const data = this.newUserForm?.value;
      const result = await this.userServe.createUser(data);
      this.userCreatedSuccessfull = true;
      this.userAlreadyExists = false;
      setTimeout(() => {
        this.userCreatedSuccessfull = false;
        this.userAlreadyExists = false;
      }, 3000);
      this.newUserForm?.reset();
      this.myf?.resetForm();
      console.log(result);
    } catch (error) {
      this.userAlreadyExists = true;
      this.userCreatedSuccessfull = false;
      this.newUserForm?.get('userName')?.setErrors(error);
      console.error(error);
    } finally {
      this.isSubmited = false;
    }
  }

}
