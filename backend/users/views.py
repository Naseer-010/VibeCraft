from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

from .serializers import (
    PatientRegisterSerializer,
    DoctorRegisterSerializer,
    UserProfileSerializer,
    CustomTokenObtainPairSerializer,
    PatientProfileSerializer,
    DoctorProfileSerializer,
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view that includes user role in response."""
    serializer_class = CustomTokenObtainPairSerializer


class PatientRegisterView(APIView):
    """Register a new patient."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PatientRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Patient registered successfully",
                "health_id": user.patient_profile.health_id,
                "email": user.email,
                "blockchain_id": user.blockchain_id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorRegisterView(APIView):
    """Register a new doctor."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = DoctorRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Doctor registered successfully. Verification pending.",
                "doctor_id": user.doctor_profile.doctor_id,
                "email": user.email,
                "blockchain_id": user.blockchain_id,
                "certificate_cid": user.doctor_profile.certificate_cid
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """Get or update current user's profile."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        user = request.user
        
        if user.role == 'PATIENT' and hasattr(user, 'patient_profile'):
            serializer = PatientProfileSerializer(
                user.patient_profile, 
                data=request.data, 
                partial=True
            )
        elif user.role == 'DOCTOR' and hasattr(user, 'doctor_profile'):
            serializer = DoctorProfileSerializer(
                user.doctor_profile, 
                data=request.data, 
                partial=True
            )
        else:
            return Response(
                {"error": "Profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        if serializer.is_valid():
            serializer.save()
            
            # Update phone on user if provided
            if 'phone' in request.data:
                user.phone = request.data['phone']
                user.save()
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DashboardStatsView(APIView):
    """Get dashboard statistics for the current user."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.role == 'PATIENT' and hasattr(user, 'patient_profile'):
            from records.models import MedicalRecord
            
            records = MedicalRecord.objects.filter(patient=user.patient_profile)
            total_records = records.count()
            
            # Get unique doctors who have created records for this patient
            unique_doctors = records.values('doctor').distinct().count()
            
            # Get last visit date
            last_record = records.first()
            last_visit = last_record.created_at.isoformat() if last_record else None
            
            # Count hidden vs visible records
            visible_count = records.filter(is_visible=True).count()
            hidden_count = records.filter(is_visible=False).count()
            
            return Response({
                'total_records': total_records,
                'unique_doctors': unique_doctors,
                'last_visit': last_visit,
                'visible_records': visible_count,
                'hidden_records': hidden_count
            })
            
        elif user.role == 'DOCTOR' and hasattr(user, 'doctor_profile'):
            from records.models import MedicalRecord
            
            records = MedicalRecord.objects.filter(doctor=user.doctor_profile)
            total_records = records.count()
            
            # Get unique patients this doctor has treated
            unique_patients = records.values('patient').distinct().count()
            
            # Get last activity date
            last_record = records.first()
            last_activity = last_record.created_at.isoformat() if last_record else None
            
            return Response({
                'total_records': total_records,
                'unique_patients': unique_patients,
                'last_activity': last_activity
            })
        
        return Response(
            {"error": "Invalid user role"},
            status=status.HTTP_400_BAD_REQUEST
        )


class PatientSearchView(APIView):
    """Search for a patient by health ID (doctors only)."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, health_id):
        if request.user.role != 'DOCTOR':
            return Response(
                {"error": "Only doctors can search patients"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            from .models import PatientProfile
            patient = PatientProfile.objects.get(health_id=health_id)
            return Response({
                "health_id": patient.health_id,
                "name": patient.full_name,
                "age": patient.age
            })
        except PatientProfile.DoesNotExist:
            return Response(
                {"error": "Patient not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )


class IPFSVerifyView(APIView):
    """Verify that a CID exists and is accessible on IPFS."""
    permission_classes = [AllowAny]  # Public verification
    
    def get(self, request, cid):
        from .ipfs_service import ipfs_service
        
        result = ipfs_service.verify_cid(cid)
        
        if result.get('success'):
            return Response({
                "cid": cid,
                "accessible": result.get('accessible', False),
                "content_type": result.get('content_type'),
                "content_length": result.get('content_length'),
                "ipfs_url": ipfs_service.get_ipfs_url(cid)
            })
        else:
            return Response({
                "cid": cid,
                "error": result.get('error', 'Verification failed')
            }, status=status.HTTP_400_BAD_REQUEST)

