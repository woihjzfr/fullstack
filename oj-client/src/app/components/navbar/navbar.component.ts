import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title = "SunYichun";
  username = "";

  profile: any;

  searchBox: FormControl = new FormControl();
  subscription: Subscription;

  constructor(@Inject('auth') private auth,
              @Inject('input') private input,
              private router : Router) {
                auth.handleAuthentication();
              }

  ngOnInit() {
    if(this.auth.isAuthenticated()) {
      this.username = this.auth.getProfile().nickname;
    }
    //
    this.subscription = this.searchBox
                            .valueChanges
                            .debounceTime(200)
                            .subscribe(
                              term => {
                                this.input.changeInput(term);
                              }
                            );

  // if(this.auth.isAuthenticated()){
  //                               if (this.auth.userProfile) {
  //                                   this.profile = this.auth.userProfile;
  //                                   this.username = this.profile.nickname;
  //                               }
  //                               else {
  //
  //                                   this.auth.getProfile((err, profile) => {
  //                                   this.profile = profile;
  //                                   this.username = this.profile.nickname;
  //                                   });
  //                                 }
  //
  //                               }
                                // this.email = this.profile.email;



  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  searchProblem(): void {
    this.router.navigate(['/problems']);
  }

  login(): void {
    this.auth.login()
    if(this.auth.isAuthenticated())
    {
      this.auth.getProfile((err, profile) => {
      this.profile = profile;
      this.username = this.profile.nickname;
      });
    }

              // .then(profile => this.username = profile.nickname)
              // .catch(error => console.log(error));
  }

  logout(): void {
    this.auth.logout();
  }
}
