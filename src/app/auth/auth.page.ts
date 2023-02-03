import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading: boolean = false;
  isLogin: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingController
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then((loadingEl) => {
        loadingEl.present();

        let request: Observable<AuthResponseData>;
        if (this.isLogin) {
          request = this.authService.login(email, password);
        } else {
          request = this.authService.signup(email, password);
        }

        request.subscribe(
          (response) => {
            loadingEl.dismiss();
            this.isLoading = false;
            this.router.navigateByUrl('/places/tabs/discover');
          },
          (errorResponse) => {
            loadingEl.dismiss();
            const code = errorResponse.error.error.message;
            let message = 'Could not sign you up, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email address alteady exits';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'Email address could not found';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'This password is not correct';
            }
            this.showAlert(message);
          }
        );
      });
  }

  showAlert(message: string) {
    this.alertController
      .create({
        header: 'An error ocurred',
        message: message,
        buttons: ['okay'],
      })
      .then((alertElement) => {
        alertElement.present();
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
    form.reset();
  }
}
