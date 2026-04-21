from django.contrib import admin
from django.urls import path, include
from .views_external import popular_movies, search_movies

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('movies.urls')),
    path('movies/popular/', popular_movies),
    path('movies/search/', search_movies),
]