from django.contrib import admin
from .models import MedicalRecord


@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('record_type', 'patient', 'doctor', 'is_visible', 'created_at')
    list_filter = ('record_type', 'is_visible', 'created_at')
    search_fields = ('patient__health_id', 'doctor__doctor_id', 'diagnosis')
    readonly_fields = ('created_at', 'updated_at')
