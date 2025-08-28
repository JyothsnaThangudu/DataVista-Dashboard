
from django.db import models
from django.contrib.auth import get_user_model

class RecentUpload(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)

class RecentChart(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
class RecentDownload(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
# Create your models here.
class WorldBankData(models.Model):
    country = models.CharField(max_length=100)
    year = models.IntegerField()
    value = models.FloatField()
    category = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.country} - {self.year} - {self.category}"