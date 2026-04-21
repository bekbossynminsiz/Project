from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Movie, Review, Watchlist, Genre, Favorite, WatchLater
from .serializers import (
    LoginSerializer,
    LogoutSerializer,
    MovieSerializer,
    ReviewSerializer,
    WatchlistSerializer,
    GenreSerializer,
    FavoriteSerializer,
    WatchLaterSerializer,
)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'username': user.username
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    username = serializer.validated_data['username']
    password = serializer.validated_data['password']

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    return Response(get_tokens_for_user(user), status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    serializer = LogoutSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        refresh_token = serializer.validated_data['refresh']
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'detail': 'Logged out successfully'}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'detail': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def movie_list_create(request):
    if request.method == 'GET':
        movies = Movie.objects.all().order_by('-id')

        search = request.GET.get('search')
        genre = request.GET.get('genre')

        if search:
            movies = movies.filter(title__icontains=search)
        if genre:
            movies = movies.filter(genre_id=genre)

        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)

    serializer = MovieSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(owner=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MovieDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            return None

    def get(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'detail': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = MovieSerializer(movie)
        return Response(serializer.data)

    def put(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'detail': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MovieSerializer(movie, data=request.data)
        if serializer.is_valid():
            serializer.save(owner=movie.owner)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'detail': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

        movie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReviewCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, movie_id):
        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({'detail': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, movie=movie)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            return None

    def put(self, request, pk):
        review = self.get_object(pk)
        if not review:
            return Response({'detail': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=review.user, movie=review.movie)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        review = self.get_object(pk)
        if not review:
            return Response({'detail': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WatchlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_obj(self, user):
        obj, _ = Watchlist.objects.get_or_create(user=user)
        return obj

    def get(self, request):
        serializer = WatchlistSerializer(self.get_obj(request.user))
        return Response(serializer.data)

    def post(self, request):
        movie_id = request.data.get('movie_id')
        if not movie_id:
            return Response({'detail': 'movie_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({'detail': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

        watchlist = self.get_obj(request.user)
        watchlist.movies.add(movie)
        return Response(WatchlistSerializer(watchlist).data)

    def delete(self, request):
        movie_id = request.data.get('movie_id')
        if not movie_id:
            return Response({'detail': 'movie_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({'detail': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

        watchlist = self.get_obj(request.user)
        watchlist.movies.remove(movie)
        return Response(WatchlistSerializer(watchlist).data)


class FavoriteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_obj(self, user):
        obj, _ = Favorite.objects.get_or_create(user=user)
        return obj

    def get(self, request):
        serializer = FavoriteSerializer(self.get_obj(request.user))
        return Response(serializer.data)

    def post(self, request):
        movie_id = request.data.get('movie_id')
        if not movie_id:
            return Response({'detail': 'movie_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({'detail': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

        fav = self.get_obj(request.user)
        fav.movies.add(movie)
        return Response(FavoriteSerializer(fav).data)

    def delete(self, request):
        movie_id = request.data.get('movie_id')
        if not movie_id:
            return Response({'detail': 'movie_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({'detail': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

        fav = self.get_obj(request.user)
        fav.movies.remove(movie)
        return Response(FavoriteSerializer(fav).data)


class WatchLaterAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_obj(self, user):
        obj, _ = WatchLater.objects.get_or_create(user=user)
        return obj

    def get(self, request):
        serializer = WatchLaterSerializer(self.get_obj(request.user))
        return Response(serializer.data)

    def post(self, request):
        movie_id = request.data.get('movie_id')
        if not movie_id:
            return Response({'detail': 'movie_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({'detail': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

        watch_later = self.get_obj(request.user)
        watch_later.movies.add(movie)
        return Response(WatchLaterSerializer(watch_later).data)

    def delete(self, request):
        movie_id = request.data.get('movie_id')
        if not movie_id:
            return Response({'detail': 'movie_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({'detail': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

        watch_later = self.get_obj(request.user)
        watch_later.movies.remove(movie)
        return Response(WatchLaterSerializer(watch_later).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def genre_list(request):
    genres = Genre.objects.filter(is_active=True).order_by('name')
    serializer = GenreSerializer(genres, many=True)
    return Response(serializer.data)