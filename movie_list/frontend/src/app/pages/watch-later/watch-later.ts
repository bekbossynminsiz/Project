import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-watch-later',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './watch-later.html',
  styleUrls: ['./watch-later.css']
})
export class WatchLaterComponent implements OnInit {
  watchLaterMovies: any[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(
    private movieService: MovieService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadWatchLater();
  }

  loadWatchLater(): void {
    this.movieService.getWatchLater().subscribe({
      next: (data: any) => {
        console.log('WATCH LATER DATA:', data);
        this.watchLaterMovies = [...(Array.isArray(data?.movies) ? data.movies : [])];
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('WATCH LATER ERROR:', err);
        this.errorMessage = err.message;
        this.successMessage = '';
        this.watchLaterMovies = [];
        this.cdr.detectChanges();
      }
    });
  }

  remove(movieId: number): void {
    this.movieService.removeFromWatchLater(movieId).subscribe({
      next: (data: any) => {
        console.log('WATCH LATER AFTER REMOVE:', data);
        this.watchLaterMovies = [...(Array.isArray(data?.movies) ? data.movies : [])];
        this.successMessage = 'Removed from watch later.';
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('REMOVE WATCH LATER ERROR:', err);
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }
}