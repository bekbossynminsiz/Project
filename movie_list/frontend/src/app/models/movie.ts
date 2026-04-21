export interface Genre {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Review {
  id: number;
  movie: number;
  user: string;
  stars: number;
  body: string;
  created_at: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  poster_url: string;
  genre: number | null;
  genre_name: string;
  owner: string;
  reviews: Review[];
}

export interface Watchlist {
  id: number;
  user: string;
  movies: Movie[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
  username: string;
}

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
}

export interface TmdbResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}