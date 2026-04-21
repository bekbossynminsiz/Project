import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';
import { MovieService } from './services/movie';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  constructor(public auth: AuthService, private movieSvc: MovieService) {}

  logout(): void {
    const refresh = this.auth.getRefreshToken();

    if (refresh) {
      this.movieSvc.logout(refresh).subscribe({
        next: () => this.auth.logout(),
        error: () => this.auth.logout()
      });
    } else {
      this.auth.logout();
    }
  }
}