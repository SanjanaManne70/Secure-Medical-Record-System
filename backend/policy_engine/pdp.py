from django.utils import timezone
from consent.models import DoctorConsent

def is_access_allowed(doctor, patient):
    print("🔥 PDP CALLED 🔥")
    print("Doctor:", doctor)
    print("Patient:", patient)

    qs = DoctorConsent.objects.filter(
        doctor=doctor,
        patient=patient,
        is_active=True,
        expires_at__gt=timezone.now()
    )

    print("Matching active consents:", qs.count())
    return qs.exists()
