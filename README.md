# DataVista: Interactive Dashboard Web Application

## Demo Video
- **YouTube (Unlisted):** https://youtu.be/atvPLNEW8GA?si=BnhkhamhirgiGKJo 
- **Google Drive:** [https://drive.google.com/file/d/1mA_kMN_mf0kYv6YMC0I-2ZoLwpVERzCS/view?usp=sharing]  

## Overview
DataVista is a full stack web application featuring a Django backend and a React frontend. It displays an interactive dashboard with global development data, including economic, population, and environmental indicators from the World Bank.

## Features
- **Dashboard:**
  - Interactive line and bar charts (Recharts)
  - Filters for country, category, and year range
  - Data fetched dynamically from Django REST API
- **Authentication:**
  - Secure login and logout (JWT-based)
  - Dashboard and data restricted to authenticated users
- **Profile Management:**
  - View and edit profile, change password/username
- **File Upload:**
  - Upload CSV files for custom data
- **Modern UI:**
  - Responsive, clean design
  - Status modals for login/registration feedback

## Data Source
- **World Bank Open Data** — downloaded and preloaded into the backend.  
- Sample CSVs in `/backend/dashboard/` for GDP, Population, etc., included in this project.

## Setup Instructions
### Backend (Django)
1. Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```
2. Run migrations:
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```
3. Start server:
  ```bash
  python manage.py runserver
  ```

### Frontend (React)
1. Install dependencies:
  ```bash
  cd frontend
  npm install
  ```
2. Start development server:
  ```bash
  npm start
  ```

## Deployment
- Backend: Render/Heroku
- Frontend: Vercel/Netlify/GitHub Pages

## API Endpoints
- `/api/register/` - Register new user
- `/api/token/` - Obtain JWT token (login)
- `/api/profile/` - Get/update profile
- `/api/change-credentials/` - Change username/password
- `/api/worldbank/` - Get World Bank data
- `/api/recent-uploads/`, `/api/recent-charts/`, `/api/recent-downloads/` - Recent activity

## Notes
- Settings tab is a placeholder (feature coming soon)
- Password must be at least 8 characters for registration
- All dashboard features require login

## Issues
- If you encounter CORS or proxy issues, ensure frontend `package.json` has:
  ```json
  "proxy": "http://localhost:8000"
  ```
- For deployment, update allowed hosts and CORS settings in Django


## Roadmap / Future Work
- Theme toggle implementation (Dark/Light mode)
- Deployment to Render/Vercel
- Export charts as PDF
- Persist uploaded datasets per user

## Author
Developed by Jyothsna
