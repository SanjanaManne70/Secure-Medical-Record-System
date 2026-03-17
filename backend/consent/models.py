from django.db import models

# Create your models here.
from django.db import models
from users.models import Patient, Doctor



class DoctorConsent(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)

    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("patient", "doctor")

    def __str__(self):
        return f"{self.patient} → {self.doctor}"