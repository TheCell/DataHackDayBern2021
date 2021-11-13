import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public isLogin: boolean = false;
  public form: FormGroup;
  private errorMessage: any;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router, 
    private formBuilder: FormBuilder) {
      this.form = this.formBuilder.group({
        name: ['username', Validators.required],
        password: ['password', Validators.required]
      });
    }

  public ngOnInit(): void {
    
  }

  public onSubmit(): void {
    console.log(...this.form.value);
  }

  public logout(): void {
    this.auth.clearStorage();
    this.router.navigate(['']);
  }

  public isUserLogin() {
    console.log(this.auth.getUserDetails());
    if (this.auth.getUserDetails() != null) {
      this.isLogin = true;
    }
  }

}
