from django.shortcuts import render
from rest_framework import viewsets
from .models import Element
from .serializers import ElementSerializer

# Create your views here.

class ElementViewSet(viewsets.ModelViewSet):
    queryset = Element.objects.all()
    serializer_class = ElementSerializer
