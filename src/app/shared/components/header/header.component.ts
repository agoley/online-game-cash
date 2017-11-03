import { Component, OnInit, OnDestroy, NgZone, trigger, transition, style, state, animate } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


import { UserService } from "app/shared/services/user.service";
import { User } from "app/models/user.interface";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-header',
  animations: [
    trigger(
      'myAnimation',
      [
        transition(
          ':enter', [
            style({ transform: 'translateX(0)', opacity: 0 }),
            animate('200ms', style({ transform: 'translateX(0)', opacity: 1 }))
          ]
        ),
        transition(
          ':leave', [
            style({ transform: 'translateX(0)', 'opacity': 1 }),
            animate('200ms', style({ transform: 'translateX(0)', opacity: 0 }))
          ]
        )]
    )
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User;
  subscription: Subscription;
  isMenu: boolean;
  menuOptions: string[];

  constructor(private zone: NgZone, private userService: UserService) {
    this.userService.user$.subscribe(data => {
      this.user = data;

      if (this.user) {
        this.menuOptions = [this.user.email, 'account', 'sign out'];
      } else {
        this.menuOptions = null;
      }
    });

    this.isMenu = false;
  }

  ngOnInit() { }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  signout() {
    this.toggleMenu();
    this.userService.signout();
  }

  toggleMenu() {
    this.isMenu = !this.isMenu;
  }
  cart($event) { }

  menuClose(event) {
    if (this.isMenu) {
      this.isMenu = false;
    }
    if (this.isMenu) {
      this.isMenu = false;
    }
  }

  onMenuSelect(event) {
    if (event === 'sign out') {
      this.signout();
    }
  }

}
