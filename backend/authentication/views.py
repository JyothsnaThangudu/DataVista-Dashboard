from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import UserProfile
from .serializers import UserProfileSerializer

from rest_framework import serializers
class ChangeCredentialsSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

class ChangeCredentialsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangeCredentialsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        username = serializer.validated_data.get('username')
        current_password = serializer.validated_data['current_password']
        new_password = serializer.validated_data['new_password']
        # Check current password
        if not user.check_password(current_password):
            return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
        # Change username if provided
        if username and username != user.username:
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
            user.username = username
        # Change password
        user.set_password(new_password)
        user.save()
        return Response({'success': 'Credentials updated.'})

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Username and password required.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            validate_password(password)
        except ValidationError as e:
            return Response({'error': e.messages}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password)
        UserProfile.objects.create(user=user)
        return Response({'success': 'User registered successfully.'}, status=status.HTTP_201_CREATED)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        data = request.data.copy()
        if 'avatar' in request.FILES:
            data['avatar'] = request.FILES['avatar']
        serializer = UserProfileSerializer(profile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
