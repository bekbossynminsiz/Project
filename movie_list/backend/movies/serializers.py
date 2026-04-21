from rest_framework import serializers
from .models import Genre, Movie, Review, Watchlist, Favorite, WatchLater

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Review
        fields = ['id', 'movie', 'user', 'stars', 'body', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'movie']


class MovieSerializer(serializers.ModelSerializer):
    genre_name = serializers.ReadOnlyField(source='genre.name')
    owner = serializers.ReadOnlyField(source='owner.username')
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            'id',
            'title',
            'description',
            'release_date',
            'poster_url',
            'genre',
            'genre_name',
            'owner',
            'reviews'
        ]
        read_only_fields = ['id', 'owner', 'genre_name', 'reviews']


class WatchlistSerializer(serializers.ModelSerializer):
    movies = MovieSerializer(many=True, read_only=True)

    class Meta:
        model = Watchlist
        fields = ['id', 'user', 'movies']
        read_only_fields = ['id', 'user', 'movies']

class FavoriteSerializer(serializers.ModelSerializer):
    movies = MovieSerializer(many=True, read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'movies']


class WatchLaterSerializer(serializers.ModelSerializer):
    movies = MovieSerializer(many=True, read_only=True)

    class Meta:
        model = WatchLater
        fields = ['id', 'movies']