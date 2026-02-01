from rest_framework import serializers
from .models import MedicalRecord


class MedicalRecordSerializer(serializers.ModelSerializer):
    """Serializer for medical records."""
    
    doctor_name = serializers.SerializerMethodField()
    hospital = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()
    patient_health_id = serializers.SerializerMethodField()
    record_type_display = serializers.SerializerMethodField()
    ipfs_url = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalRecord
        fields = [
            'id', 'record_type', 'record_type_display', 'diagnosis', 'notes',
            'document', 'ipfs_cid', 'ipfs_url', 'ipfs_metadata_cid',
            'is_visible', 'created_at', 'updated_at',
            'doctor_name', 'hospital', 'patient_name', 'patient_health_id'
        ]
        read_only_fields = ['id', 'ipfs_cid', 'ipfs_url', 'ipfs_metadata_cid', 'created_at', 'updated_at']
    
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
    
    def get_ipfs_url(self, obj):
        """Get IPFS gateway URL for the document."""
        if obj.ipfs_cid:
            from django.conf import settings
            gateway = getattr(settings, 'PINATA_GATEWAY', 'https://gateway.pinata.cloud/ipfs/')
            return f"{gateway}{obj.ipfs_cid}"
        return None


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
        from users.ipfs_service import ipfs_service
        
        patient_health_id = validated_data.pop('patient_health_id')
        patient = PatientProfile.objects.get(health_id=patient_health_id)
        doctor = self.context['request'].user.doctor_profile
        
        # Create the record first
        record = MedicalRecord.objects.create(
            patient=patient,
            doctor=doctor,
            **validated_data
        )
        
        # Upload document to IPFS if provided
        if record.document:
            try:
                result = ipfs_service.upload_file(
                    record.document.file,
                    filename=record.document.name
                )
                if result.get('success'):
                    record.ipfs_cid = result.get('cid')
                    record.save(update_fields=['ipfs_cid'])
            except Exception:
                pass  # Document saved locally, IPFS upload optional
        
        # Store record metadata on IPFS as JSON
        try:
            metadata = {
                'record_id': record.id,
                'record_type': record.record_type,
                'diagnosis': record.diagnosis,
                'patient_health_id': patient.health_id,
                'doctor_id': doctor.doctor_id,
                'created_at': record.created_at.isoformat() if record.created_at else None,
                'document_cid': record.ipfs_cid
            }
            result = ipfs_service.upload_json(metadata, name=f"record_{record.id}_metadata")
            if result.get('success'):
                record.ipfs_metadata_cid = result.get('cid')
                record.save(update_fields=['ipfs_metadata_cid'])
        except Exception:
            pass  # Metadata upload optional
        
        return record
