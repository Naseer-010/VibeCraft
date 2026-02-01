from django.db import models
from django.conf import settings
from users.models import PatientProfile, DoctorProfile


class MedicalRecord(models.Model):
    """Medical record created by doctors for patients."""
    
    RECORD_TYPES = (
        ('prescription', 'Prescription'),
        ('lab', 'Lab Report'),
        ('diagnosis', 'Diagnosis'),
        ('imaging', 'Imaging Report'),
        ('procedure', 'Procedure Notes'),
        ('consultation', 'Consultation'),
        ('follow-up', 'Follow-up Notes'),
    )
    
    patient = models.ForeignKey(
        PatientProfile, 
        on_delete=models.CASCADE, 
        related_name='medical_records'
    )
    doctor = models.ForeignKey(
        DoctorProfile, 
        on_delete=models.CASCADE, 
        related_name='created_records'
    )
    
    record_type = models.CharField(max_length=20, choices=RECORD_TYPES)
    diagnosis = models.CharField(max_length=500)
    notes = models.TextField()
    document = models.FileField(
        upload_to='medical_documents/', 
        blank=True, 
        null=True
    )
    
    is_visible = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_record_type_display()} for {self.patient} by {self.doctor}"
