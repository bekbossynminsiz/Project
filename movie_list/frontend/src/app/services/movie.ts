import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Movie,
  Review,
  Watchlist,
  Genre,
  AuthTokens,
  TmdbResponse
} from '../models/movie';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private host = window.location.hostname;
  private api = `http://${this.host}:8000/api`;
  private externalApi = `http://${this.host}:8000`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.api}/auth/login/`, { username, password })
      .pipe(catchError(this.handleError));
  }

  logout(refresh: string): Observable<any> {
    return this.http.post(`${this.api}/auth/logout/`, { refresh })
      .pipe(catchError(this.handleError));
  }

  getMovies(search?: string, genre?: number): Observable<Movie[]> {
    let params = new HttpParams();

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    if (genre) {
      params = params.set('genre', genre);
    }

    return this.http.get<Movie[]>(`${this.api}/movies/`, { params })
      .pipe(catchError(this.handleError));
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.api}/movies/${id}/`)
      .pipe(catchError(this.handleError));
  }

  createMovie(movie: Partial<Movie>): Observable<Movie> {
    return this.http.post<Movie>(`${this.api}/movies/`, movie)
      .pipe(catchError(this.handleError));
  }

  updateMovie(id: number, movie: Partial<Movie>): Observable<Movie> {
    return this.http.put<Movie>(`${this.api}/movies/${id}/`, movie)
      .pipe(catchError(this.handleError));
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/movies/${id}/`)
      .pipe(catchError(this.handleError));
  }

  createReview(movieId: number, stars: number, body: string): Observable<Review> {
    return this.http.post<Review>(`${this.api}/movies/${movieId}/reviews/`, { stars, body })
      .pipe(catchError(this.handleError));
  }

  updateReview(reviewId: number, stars: number, body: string): Observable<Review> {
    return this.http.put<Review>(`${this.api}/reviews/${reviewId}/`, { stars, body })
      .pipe(catchError(this.handleError));
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/reviews/${reviewId}/`)
      .pipe(catchError(this.handleError));
  }

  getWatchlist(): Observable<Watchlist> {
    return this.http.get<Watchlist>(`${this.api}/watchlist/`)
      .pipe(catchError(this.handleError));
  }

  addToWatchlist(movieId: number): Observable<Watchlist> {
    return this.http.post<Watchlist>(`${this.api}/watchlist/`, { movie_id: movieId })
      .pipe(catchError(this.handleError));
  }

  removeFromWatchlist(movieId: number): Observable<Watchlist> {
    return this.http.delete<Watchlist>(`${this.api}/watchlist/`, {
      body: { movie_id: movieId }
    }).pipe(catchError(this.handleError));
  }

  getFavorites(): Observable<any> {
    return this.http.get(`${this.api}/favorites/`)
      .pipe(catchError(this.handleError));
  }

  addToFavorites(movieId: number): Observable<any> {
    return this.http.post(`${this.api}/favorites/`, { movie_id: movieId })
      .pipe(catchError(this.handleError));
  }

  removeFromFavorites(movieId: number): Observable<any> {
    return this.http.delete(`${this.api}/favorites/`, {
      body: { movie_id: movieId }
    }).pipe(catchError(this.handleError));
  }

  getWatchLater(): Observable<any> {
    return this.http.get(`${this.api}/watch-later/`)
      .pipe(catchError(this.handleError));
  }

  addToWatchLater(movieId: number): Observable<any> {
    return this.http.post(`${this.api}/watch-later/`, { movie_id: movieId })
      .pipe(catchError(this.handleError));
  }

  removeFromWatchLater(movieId: number): Observable<any> {
    return this.http.delete(`${this.api}/watch-later/`, {
      body: { movie_id: movieId }
    }).pipe(catchError(this.handleError));
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.api}/genres/`)
      .pipe(catchError(this.handleError));
  }

  getPopularMovies(): Observable<TmdbResponse> {
    return this.http.get<TmdbResponse>(`${this.externalApi}/movies/popular/`)
      .pipe(catchError(this.handleError));
  }

  searchExternalMovies(query: string): Observable<TmdbResponse> {
    return this.http.get<TmdbResponse>(`${this.externalApi}/movies/search/`, {
      params: { q: query }
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let msg = 'Something went wrong. Please try again.';

    if (error?.error) {
      if (typeof error.error === 'string') {
        msg = error.error;
      } else if (error.error.detail) {
        msg = error.error.detail;
      } else if (error.error.non_field_errors?.[0]) {
        msg = error.error.non_field_errors[0];
      } else {
        const firstKey = Object.keys(error.error)[0];
        if (firstKey && Array.isArray(error.error[firstKey])) {
          msg = `${firstKey}: ${error.error[firstKey][0]}`;
        }
      }
    }

    return throwError(() => new Error(msg));
  }
}