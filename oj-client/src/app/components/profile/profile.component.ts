import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  email: string = '';
  username: string = '';
  profile: any;

  constructor(@Inject('auth') private auth) {
    auth.handleAuthentication();
   }

  ngOnInit() {
    // let profile = this.auth.getProfile();
    // this.email = profile.email;
    // this.username = profile.nickname;

    if (this.auth.userProfile) {
        this.profile = this.auth.userProfile;
    } else {
      if(this.auth.isAuthenticated()){
        this.auth.getProfile((err, profile) => {
        this.profile = profile;
        });
      }

    }
    this.email = this.profile.email;
    this.username = this.profile.nickname;

  }

  resetPassword() {
    this.auth.resetPassword();
  }
}
