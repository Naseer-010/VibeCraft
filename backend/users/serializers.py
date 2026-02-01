from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import PatientProfile, DoctorProfile, AccessRequest

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT serializer that includes user role and profile info."""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['email'] = user.email
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        
        data['role'] = user.role
        data['email'] = user.email
        data['blockchain_id'] = user.blockchain_id
        
        # Add profile-specific data
        if user.role == 'PATIENT' and hasattr(user, 'patient_profile'):
            profile = user.patient_profile
            data['name'] = profile.full_name
            data['health_id'] = profile.health_id
            data['profile_cid'] = profile.profile_cid
        elif user.role == 'DOCTOR' and hasattr(user, 'doctor_profile'):
            profile = user.doctor_profile
            data['name'] = profile.full_name
            data['doctor_id'] = profile.doctor_id
            data['is_verified'] = profile.is_verified
            data['certificate_cid'] = profile.certificate_cid
        
        return data


class PatientRegisterSerializer(serializers.Serializer):
    """Serializer for patient registration."""
    
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    age = serializers.IntegerField(required=False, allow_null=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role='PATIENT',
            phone=validated_data.get('phone', '')
        )
        
        # Generate blockchain ID for user
        user.generate_blockchain_id()
        
        PatientProfile.objects.create(
            user=user,
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            age=validated_data.get('age')
        )
        
        return user


class DoctorRegisterSerializer(serializers.Serializer):
    """Serializer for doctor registration."""
    
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    medical_license = serializers.CharField(max_length=50)
    specialization = serializers.CharField(max_length=100)
    hospital = serializers.CharField(max_length=200)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    certificate = serializers.FileField(required=False, allow_null=True)
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value
    
    def validate_medical_license(self, value):
        if DoctorProfile.objects.filter(medical_license=value).exists():
            raise serializers.ValidationError("Medical license already registered.")
        return value
    
    def create(self, validated_data):
        from .ipfs_service import ipfs_service
        
        certificate_file = validated_data.pop('certificate', None)
        
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role='DOCTOR',
            phone=validated_data.get('phone', '')
        )
        
        # Generate blockchain ID for user
        user.generate_blockchain_id()
        
        doctor_profile = DoctorProfile.objects.create(
            user=user,
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            medical_license=validated_data['medical_license'],
            specialization=validated_data['specialization'],
            hospital=validated_data['hospital']
        )
        
        # Upload certificate to IPFS if provided
        if certificate_file:
            try:
                # Save the file locally first
                doctor_profile.certificate = certificate_file
                doctor_profile.save(update_fields=['certificate'])
                
                # Upload to IPFS
                result = ipfs_service.upload_file(
                    certificate_file,
                    filename=certificate_file.name
                )
                if result.get('success'):
                    doctor_profile.certificate_cid = result.get('cid')
                    doctor_profile.save(update_fields=['certificate_cid'])
            except Exception:
                pass  # Certificate saved locally, IPFS upload optional
        
        return user


class PatientProfileSerializer(serializers.ModelSerializer):
    """Serializer for patient profile."""
    
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', required=False)
    blockchain_id = serializers.CharField(source='user.blockchain_id', read_only=True)
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = PatientProfile
        fields = [
            'health_id', 'first_name', 'last_name', 'age',
            'email', 'phone', 'profile_picture', 'profile_picture_url',
            'profile_cid', 'blockchain_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['health_id', 'profile_picture_url', 'profile_cid', 'blockchain_id', 'created_at', 'updated_at']
    
    def get_profile_picture_url(self, obj):
        """Get full URL for profile picture."""
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None


class DoctorProfileSerializer(serializers.ModelSerializer):
    """Serializer for doctor profile."""
    
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', required=False)
    blockchain_id = serializers.CharField(source='user.blockchain_id', read_only=True)
    certificate_url = serializers.SerializerMethodField()
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = DoctorProfile
        fields = [
            'doctor_id', 'first_name', 'last_name', 'medical_license',
            'specialization', 'hospital', 'is_verified',
            'email', 'phone', 'profile_picture', 'profile_picture_url',
            'certificate_cid', 'certificate_url',
            'profile_cid', 'blockchain_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['doctor_id', 'is_verified', 'profile_picture_url', 'certificate_cid', 'certificate_url', 
                          'profile_cid', 'blockchain_id', 'created_at', 'updated_at']
    
    def get_certificate_url(self, obj):
        """Get IPFS gateway URL for certificate."""
        if obj.certificate_cid:
            from django.conf import settings
            gateway = getattr(settings, 'PINATA_GATEWAY', 'https://gateway.pinata.cloud/ipfs/')
            return f"{gateway}{obj.certificate_cid}"
        return None
    
    def get_profile_picture_url(self, obj):
        """Get full URL for profile picture."""
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None


class UserProfileSerializer(serializers.Serializer):
    """Generic serializer that returns profile based on role."""
    
    def to_representation(self, instance):
        if instance.role == 'PATIENT' and hasattr(instance, 'patient_profile'):
            return {
                'role': 'PATIENT',
                'profile': PatientProfileSerializer(instance.patient_profile).data
            }
        elif instance.role == 'DOCTOR' and hasattr(instance, 'doctor_profile'):
            return {
                'role': 'DOCTOR',
                'profile': DoctorProfileSerializer(instance.doctor_profile).data
            }
        return {'role': instance.role, 'email': instance.email}


class AccessRequestSerializer(serializers.ModelSerializer):
    """Serializer for access requests."""
    
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    patient_health_id = serializers.CharField(source='patient.health_id', read_only=True)
    doctor_name = serializers.SerializerMethodField()
    doctor_hospital = serializers.SerializerMethodField()
    access_type_display = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = AccessRequest
        fields = [
            'id', 'patient_name', 'patient_health_id',
            'doctor_name', 'doctor_hospital', 'doctor_id_requested',
            'access_type', 'access_type_display',
            'status', 'status_display',
            'granted_at', 'expires_at', 'revoked_at'
        ]
        read_only_fields = ['id', 'granted_at', 'revoked_at']
    
    def get_doctor_name(self, obj):
        if obj.doctor:
            return obj.doctor.full_name
        return obj.doctor_id_requested or 'Not specified'
    
    def get_doctor_hospital(self, obj):
        if obj.doctor:
            return obj.doctor.hospital
        return None
    
    def get_access_type_display(self, obj):
        return dict(AccessRequest.ACCESS_TYPE_CHOICES).get(obj.access_type, obj.access_type)
    
    def get_status_display(self, obj):
        return dict(AccessRequest.STATUS_CHOICES).get(obj.status, obj.status)


class CreateAccessRequestSerializer(serializers.Serializer):
    """Serializer for creating access requests."""
    
    doctor_id = serializers.CharField(required=False, allow_blank=True)
    access_type = serializers.ChoiceField(
        choices=['FULL', 'TEMPORARY', 'EMERGENCY'],
        default='FULL'
    )
    
    def create(self, validated_data):
        user = self.context['request'].user
        
        if user.role != 'PATIENT' or not hasattr(user, 'patient_profile'):
            raise serializers.ValidationError("Only patients can create access requests")
        
        patient = user.patient_profile
        doctor_id = validated_data.get('doctor_id', '').strip()
        access_type = validated_data.get('access_type', 'FULL')
        
        # Try to find the doctor
        doctor = None
        if doctor_id:
            try:
                doctor = DoctorProfile.objects.get(doctor_id=doctor_id)
            except DoctorProfile.DoesNotExist:
                pass  # Save the doctor_id_requested for later
        
        # Check for existing request
        if doctor:
            existing = AccessRequest.objects.filter(patient=patient, doctor=doctor).first()
            if existing:
                # Update existing request
                existing.access_type = access_type
                existing.status = 'APPROVED'
                existing.save()
                return existing
        
        # Create new access request
        access_request = AccessRequest.objects.create(
            patient=patient,
            doctor=doctor,
            doctor_id_requested=doctor_id if not doctor else '',
            access_type=access_type,
            status='APPROVED'  # Auto-approve for now
        )
        
        return access_request

