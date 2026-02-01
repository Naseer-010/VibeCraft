from django.urls import path
from .views import (
    MedicalRecordListView,
    MedicalRecordDetailView,
    ToggleVisibilityView,
    PatientRecordsView,
)

urlpatterns = [
    path('records/', MedicalRecordListView.as_view(), name='records_list'),
    path('records/<int:record_id>/', MedicalRecordDetailView.as_view(), name='record_detail'),
    path('records/<int:record_id>/visibility/', ToggleVisibilityView.as_view(), name='toggle_visibility'),
    path('patients/<str:health_id>/records/', PatientRecordsView.as_view(), name='patient_records'),
]
