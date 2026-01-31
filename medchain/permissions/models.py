from django.db import models
from accounts.models import User

# Create your models here.

class RecordAccess(models.Model):
    patient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="granted_access"
    )
    doctor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_access"
    )
    granted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("patient", "doctor")
