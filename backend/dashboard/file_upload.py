from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.files.storage import default_storage
import pandas as pd
from .models import WorldBankData

class FileUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)
        # Save file temporarily
        file_path = default_storage.save(file_obj.name, file_obj)
        try:
            # Read CSV or Excel
            if file_obj.name.endswith('.csv'):
                df = pd.read_csv(default_storage.path(file_path))
            else:
                df = pd.read_excel(default_storage.path(file_path))

            # Check if wide format (World Bank style)
            wide_cols = {'Country Name', 'Country Code', 'Indicator Name', 'Indicator Code'}
            if wide_cols.issubset(df.columns):
                # Melt to long format
                long_df = df.melt(
                    id_vars=['Country Name', 'Country Code', 'Indicator Name', 'Indicator Code'],
                    var_name='year',
                    value_name='value'
                )
                long_df = long_df.rename(columns={
                    'Country Name': 'country',
                    'Indicator Name': 'category'
                })
                long_df = long_df[['country', 'year', 'value', 'category']]
                long_df = long_df.dropna(subset=['value'])
                df = long_df

            # Expect columns: country, year, value, category
            required_cols = {'country', 'year', 'value', 'category'}
            if not required_cols.issubset(df.columns):
                return Response({'error': 'File must contain columns: country, year, value, category.'}, status=status.HTTP_400_BAD_REQUEST)
            # Save to DB
            count = 0
            for _, row in df.iterrows():
                try:
                    WorldBankData.objects.create(
                        country=row['country'],
                        year=int(row['year']),
                        value=float(row['value']),
                        category=row['category']
                    )
                    count += 1
                except Exception:
                    continue
            # Record recent upload activity
            from .models import RecentUpload
            RecentUpload.objects.create(
                user=request.user,
                name=file_obj.name
            )
            return Response({'message': f'File uploaded and {count} records saved.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        finally:
            default_storage.delete(file_path)
