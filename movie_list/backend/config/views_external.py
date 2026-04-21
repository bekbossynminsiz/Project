import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

API_KEY = "08a135c987745598e06aff48252f68f1"


@api_view(['GET'])
@permission_classes([AllowAny])
def popular_movies(request):
    url = f"https://api.themoviedb.org/3/movie/popular?api_key={API_KEY}"
    response = requests.get(url)
    return Response(response.json())


@api_view(['GET'])
@permission_classes([AllowAny])
def search_movies(request):
    query = request.GET.get('q', '')
    url = f"https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&query={query}"
    response = requests.get(url)
    return Response(response.json())