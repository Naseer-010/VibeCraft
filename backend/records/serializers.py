from rest_framework import serializers
from .models import MedicalRecord


class MedicalRecordSerializer(serializers.ModelSerializer):
    """Serializer for medical records."""
    
    doctor_name = serializers.SerializerMethodField()
    hospital = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()
    patient_health_id = serializers.SerializerMethodField()
    record_type_display = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalRecord
        fields = [
            'id', 'record_type', 'record_type_display', 'diagnosis', 'notes',
            'document', 'is_visible', 'created_at', 'updated_at',
            'doctor_name', 'hospital', 'patient_name', 'patient_health_id'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_doctor_name(self, obj):
        return obj.doctor.full_name
    
    def get_hospital(self, obj):
        return obj.doctor.hospital
    
    def get_patient_name(self, obj):
        return obj.patient.full_name
    
    def get_patient_health_id(self, obj):
        return obj.patient.health_id
    
    def get_record_type_display(self, obj):
        return obj.get_record_type_display()


class CreateMedicalRecordSerializer(serializers.ModelSerializer):
    """Serializer for creating medical records (doctors)."""
    
    patient_health_id = serializers.CharField(write_only=True)
    
    class Meta:
        model = MedicalRecord
        fields = ['patient_health_id', 'record_type', 'diagnosis', 'notes', 'document']
    
    def validate_patient_health_id(self, value):
        from users.models import PatientProfile
        try:
            PatientProfile.objects.get(health_id=value)
        except PatientProfile.DoesNotExist:
            raise serializers.ValidationError("Patient not found with this Health ID.")
        return value
    
    def create(self, validated_data):
        from users.models import PatientProfile
        patient_health_id = validated_data.pop('patient_health_id')
        patient = PatientProfile.objects.get(health_id=patient_health_id)
        doctor = self.context['request'].user.doctor_profile
        
        return MedicalRecord.objects.create(
            patient=patient,
            doctor=doctor,
            **validated_data
        )
