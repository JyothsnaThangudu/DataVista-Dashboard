from django.urls import path

from .views import WorldBankDataList, RecentUploadList, RecentChartList, RecentDownloadList
from .file_upload import FileUploadView

urlpatterns = [
    path('api/worldbank/', WorldBankDataList.as_view(), name='worldbank-list'),
    path('api/upload/', FileUploadView.as_view(), name='file-upload'),
    path('api/recent-uploads/', RecentUploadList.as_view(), name='recent-uploads'),
    path('api/recent-charts/', RecentChartList.as_view(), name='recent-charts'),
    path('api/recent-downloads/', RecentDownloadList.as_view(), name='recent-downloads'),
]

