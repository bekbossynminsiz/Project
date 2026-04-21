import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MovieService } from '../../services/movie';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private movieService: MovieService,
    private auth: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = '';
    this.loading = true;

    this.movieService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.auth.setSession(res.access, res.refresh, res.username);
        this.loading = false;
        this.router.navigate(['/movies']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message;
      }
    });
  }
}