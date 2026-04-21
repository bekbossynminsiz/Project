import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MovieService } from '../../services/movie';
import { AuthService } from '../../services/auth';
import { Genre, Movie, TmdbMovie } from '../../models/movie';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movie-list.html',
  styleUrls: ['./movie-list.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  popularMovies: TmdbMovie[] = [];
  genres: Genre[] = [];

  searchText = '';
  selectedGenre = '0';
  externalQuery = '';

  newTitle = '';
  newDescription = '';
  newReleaseDate = '';
  newPosterUrl = '';
  newGenre = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private movieService: MovieService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGenres();
    this.loadMovies();
    this.loadPopularMovies();
  }

  loadGenres(): void {
    this.movieService.getGenres().subscribe({
      next: (data) => {
        this.genres = data;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }

  loadMovies(): void {
    const genreValue =
      this.selectedGenre && this.selectedGenre !== '0'
        ? Number(this.selectedGenre)
        : undefined;

    this.movieService.getMovies(this.searchText.trim(), genreValue).subscribe({
      next: (data) => {
        this.movies = data;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }

  loadPopularMovies(): void {
    this.movieService.getPopularMovies().subscribe({
      next: (data) => {
        this.popularMovies = data.results;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }

  searchExternalMovies(): void {
    if (!this.externalQuery.trim()) {
      this.loadPopularMovies();
      return;
    }

    this.movieService.searchExternalMovies(this.externalQuery.trim()).subscribe({
      next: (data) => {
        this.popularMovies = data.results;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }

  createMovie(): void {
    const genreId = this.newGenre ? Number(this.newGenre) : 0;

    if (!this.newTitle.trim() || !genreId) {
      this.errorMessage = 'Title and genre are required.';
      this.successMessage = '';
      return;
    }

    const payload: any = {
      title: this.newTitle.trim(),
      description: this.newDescription.trim(),
      genre: genreId
    };

    if (this.newReleaseDate) {
      payload.release_date = this.newReleaseDate;
    }

    if (this.newPosterUrl.trim()) {
      payload.poster_url = this.newPosterUrl.trim();
    }

    this.movieService.createMovie(payload).subscribe({
      next: (movie) => {
        console.log('CREATED MOVIE:', movie);
        this.successMessage = `Movie "${movie.title}" created successfully.`;
        this.errorMessage = '';
        this.clearForm();
        this.searchText = '';
        this.selectedGenre = '0';
        this.loadMovies();
      },
      error: (err) => {
        console.error('CREATE MOVIE ERROR:', err);
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }

  saveTmdbMovie(movie: TmdbMovie): void {
    const fallbackGenre = this.genres.length > 0 ? this.genres[0].id : null;

    if (!fallbackGenre) {
      this.errorMessage = 'No genres found. Please add genres in admin first.';
      this.successMessage = '';
      return;
    }

    const payload: any = {
      title: movie.title,
      description: movie.overview || '',
      genre: fallbackGenre
    };

    if (movie.release_date) {
      payload.release_date = movie.release_date;
    }

    if (movie.poster_path) {
      payload.poster_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }

    this.movieService.createMovie(payload).subscribe({
      next: (createdMovie) => {
        console.log('TMDB SAVED TO DB:', createdMovie);
        this.successMessage = `"${createdMovie.title}" saved to My Movies 💾`;
        this.errorMessage = '';
        this.loadMovies();
      },
      error: (err) => {
        console.error('SAVE TMDB ERROR:', err);
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }

  saveTmdbMovieAndAddToWatchlist(movie: TmdbMovie): void {
    const fallbackGenre = this.genres.length > 0 ? this.genres[0].id : null;

    if (!fallbackGenre) {
      this.errorMessage = 'No genres found. Please add genres in admin first.';
      this.successMessage = '';
      return;
    }

    const payload: any = {
      title: movie.title,
      description: movie.overview || '',
      genre: fallbackGenre
    };

    if (movie.release_date) {
      payload.release_date = movie.release_date;
    }

    if (movie.poster_path) {
      payload.poster_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }

    this.movieService.createMovie(payload).subscribe({
      next: (createdMovie) => {
        console.log('CREATED FROM TMDB:', createdMovie);

        this.movieService.addToWatchlist(createdMovie.id).subscribe({
          next: (watchlist) => {
            console.log('WATCHLIST AFTER ADD:', watchlist);
            this.successMessage = `"${createdMovie.title}" saved and added to watchlist 📺`;
            this.errorMessage = '';
            this.loadMovies();
            this.router.navigate(['/watchlist']);
          },
          error: (err) => {
            console.error('ADD TO WATCHLIST ERROR:', err);
            this.errorMessage = err.message;
            this.successMessage = '';
          }
        });
      },
      error: (err) => {
        console.error('CREATE FROM TMDB ERROR:', err);
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }

  addToWatchlist(movieId: number): void {
    console.log('ADDING EXISTING MOVIE TO WATCHLIST:', movieId);

    this.movieService.addToWatchlist(movieId).subscribe({
      next: (watchlist) => {
        console.log('WATCHLIST AFTER ADD:', watchlist);
        this.successMessage = 'Added to watchlist 📺';
        this.errorMessage = '';
        this.router.navigate(['/watchlist']);
      },
      error: (err) => {
        console.error('ADD TO WATCHLIST ERROR:', err);
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }

  addToFavorites(movieId: number): void {
    this.movieService.addToFavorites(movieId).subscribe({
      next: () => {
        this.successMessage = 'Added to favorites ⭐';
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('ADD TO FAVORITES ERROR:', err);
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }

  addToWatchLater(movieId: number): void {
    this.movieService.addToWatchLater(movieId).subscribe({
      next: () => {
        this.successMessage = 'Saved for later ⏰';
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('ADD TO WATCH LATER ERROR:', err);
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }

  deleteMovie(id: number): void {
    this.movieService.deleteMovie(id).subscribe({
      next: () => {
        this.successMessage = 'Movie deleted.';
        this.errorMessage = '';
        this.loadMovies();
      },
      error: (err) => {
        console.error('DELETE MOVIE ERROR:', err);
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }

  clearForm(): void {
    this.newTitle = '';
    this.newDescription = '';
    this.newReleaseDate = '';
    this.newPosterUrl = '';
    this.newGenre = '';
  }

  getPoster(path: string | null | undefined): string {
    if (!path) {
      return 'https://via.placeholder.com/300x450?text=No+Image';
    }
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}