from consent.models import DoctorConsent
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from users.serializers import DoctorRegisterSerializer, PatientRegisterSerializer
from users.models import Doctor,PatientDoctor,Patient
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from crypto_engine.hybrid_crypto import generate_kyber_keypair

class DoctorRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = DoctorRegisterSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            if User.objects.filter(username=data["username"]).exists():
                return Response(
                    {"error": "Username already exists"},
                    status=400
                )
            user = User.objects.create(
                username=data["username"],
                email=data["email"],
                password=make_password(data["password"])
            )
            public_key, private_key = generate_kyber_keypair()

            Doctor.objects.create(
            user=user,
            name=data["name"],
            department=data["department"],
            license_no=data["license_no"],
            public_kyber_key=public_key,
            private_kyber_key=private_key
)

            return Response({"message": "Doctor registered successfully"}, status=201)

        return Response(serializer.errors, status=400)
class DoctorListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        doctors = Doctor.objects.all()

        data = [
            {
                "id": d.id,
                "name": d.name
            }
            for d in doctors
        ]

        return Response(data)

class MyDoctorsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        patient = request.user.patient
        mappings = PatientDoctor.objects.filter(patient=patient)

        return Response([
            {
                "id": m.doctor.id,
                "name": m.doctor.name
            }
            for m in mappings
        ])
    
class AddDoctorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        patient = request.user.patient
        doctor_id = request.data.get("doctor_id")

        try:
            doctor = Doctor.objects.get(id=doctor_id)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=404)

        PatientDoctor.objects.get_or_create(
            patient=patient,
            doctor=doctor
        )

        return Response({"message": "Doctor added"}, status=201)


class RemoveDoctorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        patient = request.user.patient
        doctor_id = request.data.get("doctor_id")

        if not doctor_id:
            return Response({"error": "doctor_id required"}, status=400)

        # 1️⃣ Remove relationship
        PatientDoctor.objects.filter(
            patient=patient,
            doctor_id=doctor_id
        ).delete()

        # 2️⃣ 🔥 Revoke consent
        updated = DoctorConsent.objects.filter(
            patient=patient,
            doctor_id=doctor_id,
            is_active=True
        ).update(is_active=False)

        print("🔥 CONSENT UPDATED COUNT:", updated)

        return Response({
            "message": "Doctor removed and consent revoked"
        })
class PatientRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PatientRegisterSerializer(data=request.data)

        if serializer.is_valid():
            data = serializer.validated_data

            user = User.objects.create(
                username=data["username"],
                email=data["email"],
                password=make_password(data["password"])
            )

            Patient.objects.create(
                user=user,
                name=data["name"],
                age=data["age"],
                phone=data["phone"]
            )

            return Response(
                {"message": "Patient registered successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if hasattr(user, "doctor"):
            return Response({"role": "doctor"})

        if hasattr(user, "patient"):
            return Response({"role": "patient"})

        return Response({"role": "unknown"})