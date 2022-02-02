import { Component } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'schtroumpfbook_client';

  constructor(private auth: AuthenticationService) {}

  logout() {
    this.auth.logout();
  }

  isLoggedIn() {
  return  this.auth.isLoggedIn();
  }
}
