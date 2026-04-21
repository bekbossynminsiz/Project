import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css']
})
export class FavoritesComponent implements OnInit {
  favoriteMovies: any[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(
    private movieService: MovieService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.movieService.getFavorites().subscribe({
      next: (data: any) => {
        console.log('FAVORITES DATA:', data);
        this.favoriteMovies = [...(Array.isArray(data?.movies) ? data.movies : [])];
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('FAVORITES ERROR:', err);
        this.errorMessage = err.message;
        this.successMessage = '';
        this.favoriteMovies = [];
        this.cdr.detectChanges();
      }
    });
  }

  remove(movieId: number): void {
    this.movieService.removeFromFavorites(movieId).subscribe({
      next: (data: any) => {
        console.log('FAVORITES AFTER REMOVE:', data);
        this.favoriteMovies = [...(Array.isArray(data?.movies) ? data.movies : [])];
        this.successMessage = 'Removed from favorites.';
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('REMOVE FAVORITES ERROR:', err);
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }
}