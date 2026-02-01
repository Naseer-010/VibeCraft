# HealthSecure Backend

Django REST API backend for the HealthSecure healthcare application.

## Setup

1. Activate virtual environment:
   ```bash
   source ../env/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Start server:
   ```bash
   python manage.py runserver 8000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register/patient/` - Register as patient
- `POST /api/auth/register/doctor/` - Register as doctor
- `POST /api/auth/login/` - Login (returns JWT)
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/profile/` - Get current user profile
- `PUT /api/auth/profile/` - Update profile

### Medical Records
- `GET /api/records/` - List records
- `POST /api/records/` - Create record (doctors)
- `GET /api/records/<id>/` - Get single record
- `PATCH /api/records/<id>/visibility/` - Toggle visibility (patients)
- `GET /api/patients/<health_id>/records/` - Doctor view patient records
