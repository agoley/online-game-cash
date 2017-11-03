import { Component } from '@angular/core';
import { UserService } from "app/shared/services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [UserService]
})
export class AppComponent {
  title = 'online-game-cash works!';
}
