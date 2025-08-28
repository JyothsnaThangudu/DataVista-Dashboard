from django.urls import path
from .views import RegisterView, UserProfileView, ChangeCredentialsView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Refresh token
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/change-credentials/', ChangeCredentialsView.as_view(), name='change-credentials'),
]
