from rest_framework import serializers
from .models import WorldBankData
from .models import RecentUpload, RecentChart
from .models import RecentDownload

class RecentDownloadSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentDownload
        fields = ['name', 'date']

class RecentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentUpload
        fields = ['name', 'date']

class RecentChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentChart
        fields = ['name', 'date']

class WorldBankDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorldBankData
        fields = '__all__'