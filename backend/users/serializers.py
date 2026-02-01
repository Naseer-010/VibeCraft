from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import PatientProfile, DoctorProfile

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
        
        # Add profile-specific data
        if user.role == 'PATIENT' and hasattr(user, 'patient_profile'):
            profile = user.patient_profile
            data['name'] = profile.full_name
            data['health_id'] = profile.health_id
        elif user.role == 'DOCTOR' and hasattr(user, 'doctor_profile'):
            profile = user.doctor_profile
            data['name'] = profile.full_name
            data['doctor_id'] = profile.doctor_id
            data['is_verified'] = profile.is_verified
        
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
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value
    
    def validate_medical_license(self, value):
        if DoctorProfile.objects.filter(medical_license=value).exists():
            raise serializers.ValidationError("Medical license already registered.")
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role='DOCTOR',
            phone=validated_data.get('phone', '')
        )
        
        DoctorProfile.objects.create(
            user=user,
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            medical_license=validated_data['medical_license'],
            specialization=validated_data['specialization'],
            hospital=validated_data['hospital']
        )
        
        return user


class PatientProfileSerializer(serializers.ModelSerializer):
    """Serializer for patient profile."""
    
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', required=False)
    
    class Meta:
        model = PatientProfile
        fields = [
            'health_id', 'first_name', 'last_name', 'age',
            'email', 'phone', 'created_at', 'updated_at'
        ]
        read_only_fields = ['health_id', 'created_at', 'updated_at']


class DoctorProfileSerializer(serializers.ModelSerializer):
    """Serializer for doctor profile."""
    
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', required=False)
    
    class Meta:
        model = DoctorProfile
        fields = [
            'doctor_id', 'first_name', 'last_name', 'medical_license',
            'specialization', 'hospital', 'is_verified',
            'email', 'phone', 'created_at', 'updated_at'
        ]
        read_only_fields = ['doctor_id', 'is_verified', 'created_at', 'updated_at']


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
