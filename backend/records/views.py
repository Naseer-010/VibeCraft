from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import MedicalRecord
from .serializers import MedicalRecordSerializer, CreateMedicalRecordSerializer
from users.models import PatientProfile


class MedicalRecordListView(APIView):
    """List and create medical records."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.role == 'PATIENT':
            # Patient sees their own records
            records = MedicalRecord.objects.filter(
                patient=user.patient_profile
            )
        elif user.role == 'DOCTOR':
            # Doctor sees records they created
            records = MedicalRecord.objects.filter(
                doctor=user.doctor_profile
            )
        else:
            return Response(
                {"error": "Invalid role"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = MedicalRecordSerializer(records, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        # Only doctors can create records
        if request.user.role != 'DOCTOR':
            return Response(
                {"error": "Only doctors can create medical records"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = CreateMedicalRecordSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            record = serializer.save()
            return Response(
                MedicalRecordSerializer(record).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MedicalRecordDetailView(APIView):
    """Get single record details."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, record_id):
        user = request.user
        
        try:
            record = MedicalRecord.objects.get(id=record_id)
        except MedicalRecord.DoesNotExist:
            return Response(
                {"error": "Record not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check permission
        if user.role == 'PATIENT':
            if record.patient.user != user:
                return Response(
                    {"error": "Access denied"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        elif user.role == 'DOCTOR':
            # Doctor can view if record is visible or they created it
            if record.doctor.user != user and not record.is_visible:
                return Response(
                    {"error": "Access denied"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        
        serializer = MedicalRecordSerializer(record)
        return Response(serializer.data)


class ToggleVisibilityView(APIView):
    """Toggle record visibility (patients only)."""
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, record_id):
        if request.user.role != 'PATIENT':
            return Response(
                {"error": "Only patients can toggle visibility"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            record = MedicalRecord.objects.get(
                id=record_id,
                patient=request.user.patient_profile
            )
        except MedicalRecord.DoesNotExist:
            return Response(
                {"error": "Record not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        record.is_visible = not record.is_visible
        record.save()
        
        return Response({
            "id": record.id,
            "is_visible": record.is_visible,
            "message": f"Record is now {'visible' if record.is_visible else 'hidden'}"
        })


class PatientRecordsView(APIView):
    """View patient records by health ID (doctors only)."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, health_id):
        if request.user.role != 'DOCTOR':
            return Response(
                {"error": "Only doctors can view patient records"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            patient = PatientProfile.objects.get(health_id=health_id)
        except PatientProfile.DoesNotExist:
            return Response(
                {"error": "Patient not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Only show visible records to doctors (except those they created)
        records = MedicalRecord.objects.filter(
            patient=patient
        ).filter(
            # Show if visible OR created by this doctor
            models__in=[
                MedicalRecord.objects.filter(is_visible=True),
                MedicalRecord.objects.filter(doctor=request.user.doctor_profile)
            ]
        ).distinct()
        
        # Simpler approach - filter in code
        all_records = MedicalRecord.objects.filter(patient=patient)
        visible_records = [
            r for r in all_records 
            if r.is_visible or r.doctor == request.user.doctor_profile
        ]
        
        serializer = MedicalRecordSerializer(visible_records, many=True)
        return Response({
            "patient": {
                "health_id": patient.health_id,
                "name": patient.full_name,
                "age": patient.age
            },
            "records": serializer.data
        })
