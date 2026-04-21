import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MovieListComponent } from './pages/movie-list/movie-list';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail';
import { WatchlistComponent } from './pages/watchlist/watchlist';
import { FavoritesComponent } from './pages/favorites/favorites';
import { WatchLaterComponent } from './pages/watch-later/watch-later';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/:id', component: MovieDetailComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'watch-later', component: WatchLaterComponent },
  { path: '**', redirectTo: 'movies' }
];