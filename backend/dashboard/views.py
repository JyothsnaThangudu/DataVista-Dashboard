from django.shortcuts import render

from rest_framework import generics
from .models import WorldBankData
from .serializers import WorldBankDataSerializer

from rest_framework import generics, permissions
from .models import RecentUpload, RecentChart
from .serializers import RecentUploadSerializer, RecentChartSerializer
from .models import RecentDownload
from .serializers import RecentDownloadSerializer
from rest_framework.response import Response

class RecentDownloadList(generics.ListAPIView):
    serializer_class = RecentDownloadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RecentDownload.objects.filter(user=self.request.user).order_by('-date')[:10]

    def post(self, request, *args, **kwargs):
        name = request.data.get('name', 'Custom Chart')
        RecentDownload.objects.create(user=request.user, name=name)
        return Response({'message': 'Download logged.'}, status=201)

class RecentUploadList(generics.ListAPIView):
    serializer_class = RecentUploadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RecentUpload.objects.filter(user=self.request.user).order_by('-date')[:10]

class RecentChartList(generics.ListAPIView):
    serializer_class = RecentChartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RecentChart.objects.filter(user=self.request.user).order_by('-date')[:10]

class WorldBankDataList(generics.ListAPIView):
    serializer_class = WorldBankDataSerializer

    def get_queryset(self):
        queryset = WorldBankData.objects.all()
        country = self.request.query_params.get('country')
        category = self.request.query_params.get('category')
        year = self.request.query_params.get('year')
        if country:
            queryset = queryset.filter(country=country)
        if category:
            queryset = queryset.filter(category=category)
        if year:
            queryset = queryset.filter(year=year)
        # Record chart view activity
        if self.request.user.is_authenticated and (country or category):
            from .models import RecentChart
            chart_name = f"{country or ''} {category or ''}".strip()
            if chart_name:
                RecentChart.objects.create(user=self.request.user, name=chart_name)
        return queryset

