from django.db import models
import os
from django.contrib.auth.models import User
from django.conf import settings

class Patient(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    phone = models.CharField(max_length=15)
    # 🔐 Symmetric master key
    master_key = models.BinaryField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.master_key:
            self.master_key = os.urandom(32)  # 256-bit key
        super().save(*args, **kwargs)

class Doctor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    license_no = models.CharField(max_length=50)
    # 🔐 Kyber keys
    public_kyber_key = models.BinaryField(null=True, blank=True)
    private_kyber_key = models.BinaryField(null=True, blank=True)

    def __str__(self):
        return self.name

class DoctorKey(models.Model):
    doctor = models.OneToOneField(Doctor, on_delete=models.CASCADE)
    kyber_public_key = models.BinaryField()

    def __str__(self):
        return f"Key for {self.doctor.name}"
    
    # users/models.py
class PatientDoctor(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("patient", "doctor")