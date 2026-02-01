import uuid
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        return self.create_user(email, password, **extra_fields)


def generate_health_id():
    """Generate unique health ID in format HID-XXXX-YYYY."""
    uid = uuid.uuid4().hex[:8].upper()
    return f"HID-{uid[:4]}-{uid[4:]}"


def generate_doctor_id():
    """Generate unique doctor ID in format DOC-XXXX-YYYY."""
    uid = uuid.uuid4().hex[:8].upper()
    return f"DOC-{uid[:4]}-{uid[4:]}"


class User(AbstractUser):
    """Custom User model supporting email login and role-based profiles."""
    
    ROLE_CHOICES = (
        ('PATIENT', 'Patient'),
        ('DOCTOR', 'Doctor'),
        ('ADMIN', 'Admin'),
    )
    
    username = None  # Remove username, use email instead
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=20, blank=True)
    
    # Blockchain/IPFS identity
    blockchain_id = models.CharField(
        max_length=64, 
        unique=True, 
        null=True, 
        blank=True,
        help_text="SHA256 hash serving as blockchain identity"
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = UserManager()
    
    def __str__(self):
        return self.email
    
    def generate_blockchain_id(self):
        """Generate blockchain ID from email and creation time."""
        from .ipfs_service import generate_blockchain_id
        if not self.blockchain_id and self.date_joined:
            self.blockchain_id = generate_blockchain_id(self.email, self.date_joined)
            self.save(update_fields=['blockchain_id'])
        return self.blockchain_id


class PatientProfile(models.Model):
    """Patient-specific profile information."""
    
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='patient_profile'
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField(null=True, blank=True)
    health_id = models.CharField(
        max_length=20, 
        unique=True, 
        default=generate_health_id
    )
    # IPFS profile metadata CID
    profile_cid = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="IPFS CID for patient profile metadata"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.health_id})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class DoctorProfile(models.Model):
    """Doctor-specific profile information."""
    
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='doctor_profile'
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    medical_license = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=100)
    hospital = models.CharField(max_length=200)
    doctor_id = models.CharField(
        max_length=20, 
        unique=True, 
        default=generate_doctor_id
    )
    is_verified = models.BooleanField(default=False)
    certificate = models.FileField(
        upload_to='doctor_certificates/', 
        blank=True, 
        null=True
    )
    # IPFS CID for doctor certificate
    certificate_cid = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="IPFS CID for uploaded certificate"
    )
    # IPFS profile metadata CID
    profile_cid = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="IPFS CID for doctor profile metadata"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name} ({self.doctor_id})"
    
    @property
    def full_name(self):
        return f"Dr. {self.first_name} {self.last_name}"
