import csv
from dashboard.models import WorldBankData

def import_data(filename, category):
    with open(filename, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        rows = list(reader)
        header = rows[4]  # The row with column names (years start from index 4)
        for row in rows[5:]:  # Data starts from row 6 (index 5)
            country = row[0]
            for col_idx in range(4, len(header)):
                year = header[col_idx]
                value = row[col_idx]
                if value:
                    try:
                        WorldBankData.objects.create(
                            country=country,
                            year=int(year),
                            value=float(value),
                            category=category
                        )
                    except Exception as e:
                        print(f"Error importing {country}, {year}: {e}")