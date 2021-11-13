import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public isLogin = false;
  public form: FormGroup;
  public errorMessage: any;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router, 
    private formBuilder: FormBuilder) {
      this.form = this.formBuilder.group({
        username: ['username', Validators.required],
        email: ['email', Validators.required],
        password: ['password', Validators.required]
      });
    }

  public ngOnInit(): void {
    this.isUserLogin();
  }
  
  public onSubmit(): void {
    console.log('todo register')
    this.api.postTypeRequest('user/register', this.form.value).subscribe((res: any) => {
      if (res.status) {
        console.log(res);
        this.auth.setDataInLocalStorage('userData', JSON.stringify(res.data));
        this.auth.setDataInLocalStorage('token', res.token);
        this.router.navigate(['login']);
      } else {
        console.log(res);
        console.error(res.msg);
      }
    }, (error) => {
      this.errorMessage = error['error'].message;
    });
  }

  public isUserLogin(): void {
    if(this.auth.getUserDetails() != null) {
      this.isLogin = true;
    }
  }
}
