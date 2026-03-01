from django.db import models
# Create your models here.
from django.db import models
from users.models import Patient, Doctor


class MedicalRecord(models.Model):
    CATEGORY_CHOICES = [
        ("personal", "Personal Details"),
        ("prescription", "Prescription"),
        ("lab", "Lab Report"),
        ("scan", "Scan"),
        ("general", "General"),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    encrypted_data = models.BinaryField()
    nonce = models.BinaryField(null=True, blank=True)

# 🔐 Patient-wrapped AES key
    patient_wrapped_key = models.BinaryField(null=True, blank=True)
    patient_wrap_nonce = models.BinaryField(null=True, blank=True)

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="general"
    )

    original_filename = models.CharField(   # ✅ ADD THIS
        max_length=255,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Record {self.id} ({self.category})"
    
class RecordAssignment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("patient", "doctor")

    def __str__(self):
        return f"{self.patient} → {self.doctor}"

class RecordDoctorKey(models.Model):
    record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)

    wrapped_aes_key = models.BinaryField()

    kyber_ciphertext = models.BinaryField()
    wrap_nonce = models.BinaryField()

    class Meta:
        unique_together = ("record", "doctor")

class AccessAuditLog(models.Model):
    doctor = models.ForeignKey("users.Doctor", on_delete=models.CASCADE)
    patient = models.ForeignKey("users.Patient", on_delete=models.CASCADE)
    record = models.ForeignKey("records.MedicalRecord", on_delete=models.CASCADE)

    action = models.CharField(max_length=50)
    purpose = models.CharField(max_length=255)

    accessed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True)

