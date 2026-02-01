from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    PatientRegisterView,
    DoctorRegisterView,
    ProfileView,
    PatientSearchView,
    DashboardStatsView,
    IPFSVerifyView,
    AccessRequestView,
    RevokeAccessView,
)

urlpatterns = [
    # Authentication
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Registration
    path('register/patient/', PatientRegisterView.as_view(), name='register_patient'),
    path('register/doctor/', DoctorRegisterView.as_view(), name='register_doctor'),
    
    # Profile
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # Dashboard stats
    path('stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    
    # Patient search (for doctors)
    path('patients/<str:health_id>/', PatientSearchView.as_view(), name='patient_search'),
    
    # Access requests
    path('access/', AccessRequestView.as_view(), name='access_requests'),
    path('access/<int:request_id>/revoke/', RevokeAccessView.as_view(), name='revoke_access'),
    
    # IPFS verification
    path('ipfs/verify/<str:cid>/', IPFSVerifyView.as_view(), name='ipfs_verify'),
]
