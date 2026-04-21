import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-detail.html',
  styleUrls: ['./movie-detail.css']
})
export class MovieDetailComponent implements OnInit {
  movieData: any = null;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('MOVIE ID:', id);

    this.movieService.getMovie(id).subscribe({
      next: (data: any) => {
        console.log('MOVIE DATA:', data);
        this.movieData = { ...data };
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('DETAIL ERROR:', err);
        this.errorMessage = err.message;
        this.movieData = null;
        this.cdr.detectChanges();
      }
    });
  }
}