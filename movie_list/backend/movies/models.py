from django.db import models
from django.contrib.auth.models import User


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    release_date = models.DateField(null=True, blank=True)
    poster_url = models.URLField(blank=True)
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, related_name='movies')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='movies', null=True)
    def __str__(self):
        return self.title


class Review(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    stars = models.PositiveSmallIntegerField()
    body = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.movie.title} - {self.stars}'


class Watchlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='watchlist')
    movies = models.ManyToManyField(Movie, blank=True, related_name='in_watchlists')

    def __str__(self):
        return f"{self.user.username}'s watchlist"
    
class Favorite(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='favorites')
    movies = models.ManyToManyField(Movie, blank=True, related_name='in_favorites')

    def __str__(self):
        return f"{self.user.username}'s favorites"


class WatchLater(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='watch_later')
    movies = models.ManyToManyField(Movie, blank=True, related_name='in_watch_later')

    def __str__(self):
        return f"{self.user.username}'s watch later"