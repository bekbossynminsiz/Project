import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './watchlist.html',
  styleUrls: ['./watchlist.css']
})
export class WatchlistComponent implements OnInit {
  watchlistMovies: any[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(
    private movieService: MovieService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    this.movieService.getWatchlist().subscribe({
      next: (data: any) => {
        console.log('WATCHLIST DATA:', data);

        // 🔥 ключевой фикс
        this.watchlistMovies = [...(data?.movies || [])];

        // 🔥 принудительное обновление
        this.cdr.detectChanges();

        this.errorMessage = '';
      },
      error: (err: any) => {
        console.error('ERROR:', err);
        this.errorMessage = err.message;
        this.watchlistMovies = [];
        this.cdr.detectChanges();
      }
    });
  }

  remove(movieId: number): void {
    this.movieService.removeFromWatchlist(movieId).subscribe({
      next: (data: any) => {
        this.watchlistMovies = [...(data?.movies || [])];
        this.successMessage = 'Removed from watchlist';
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }
}