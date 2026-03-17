from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated

from consent.models import DoctorConsent
from users.models import Doctor



class GrantDoctorConsent(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        patient = request.user.patient
        doctor_id = request.data.get("doctor_id")
        duration_days = int(request.data.get("duration_days", 7))

        try:
            doctor = Doctor.objects.get(id=doctor_id)
        except Doctor.DoesNotExist:
            return Response(
                {"error": "Doctor not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        consent, _ = DoctorConsent.objects.update_or_create(
            patient=patient,
            doctor=doctor,
            defaults={
                "is_active": True,
                "expires_at": timezone.now() + timedelta(days=duration_days)
            }
        )

        return Response(
            {
                "message": "Consent granted successfully",
                "expires_at": consent.expires_at
            },
            status=status.HTTP_201_CREATED
        )


class RevokeDoctorConsent(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        patient = request.user.patient
        doctor_id = request.data.get("doctor_id")

        updated = DoctorConsent.objects.filter(
            patient=patient,
            doctor_id=doctor_id,
            is_active=True
        ).update(
            is_active=False,
        )

        if updated == 0:
            return Response(
                {"error": "No active consent found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {"message": "Consent revoked successfully"},
            status=status.HTTP_200_OK
        )

class MyDoctorsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        patient = request.user.patient
        consents = DoctorConsent.objects.filter(patient=patient,is_active=True)

        return Response([
            {
                "id": c.doctor.id,
                "name": c.doctor.name,

    }
            for c in consents
        ])
    
