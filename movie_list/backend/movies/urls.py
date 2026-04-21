from django.urls import path
from .views import (
    login_view,
    logout_view,
    movie_list_create,
    MovieDetailAPIView,
    ReviewCreateAPIView,
    ReviewDetailAPIView,
    WatchlistAPIView,
    FavoriteAPIView,
    WatchLaterAPIView,
    genre_list,
)

urlpatterns = [
    path('auth/login/', login_view),
    path('auth/logout/', logout_view),

    path('movies/', movie_list_create),
    path('movies/<int:pk>/', MovieDetailAPIView.as_view()),

    path('movies/<int:movie_id>/reviews/', ReviewCreateAPIView.as_view()),
    path('reviews/<int:pk>/', ReviewDetailAPIView.as_view()),

    path('watchlist/', WatchlistAPIView.as_view()),
    path('favorites/', FavoriteAPIView.as_view()),
    path('watch-later/', WatchLaterAPIView.as_view()),
    path('genres/', genre_list),
]