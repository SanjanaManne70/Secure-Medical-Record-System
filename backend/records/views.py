from users.models import Doctor
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from records.encryption_service import encrypt_and_store_record
from records.decryption_service import decrypt_and_load_record, decrypt_for_patient
from records.models import MedicalRecord, AccessAuditLog,RecordAssignment,RecordDoctorKey
from policy_engine.pdp import is_access_allowed
import base64

class ViewMedicalRecord(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, record_id):
        try:
            doctor = request.user.doctor

            plaintext = decrypt_and_load_record(record_id, doctor)

            return Response({
                "record_id": record_id,
                "plaintext": plaintext.decode(errors="ignore")
            })

        except PermissionError:
            return Response(
                {"error": "Access denied"},
                status=403
            )

        except Exception as e:
            print("DECRYPT ERROR:", str(e))
            return Response(
                {"error": "Failed to decrypt"},
                status=500
            )

class PatientAuditLogs(APIView):
    def get(self, request):
        logs = AccessAuditLog.objects.filter(
            patient=request.user.patient
        ).order_by("-accessed_at")

        data = [
            {
                "doctor": log.doctor.name,
                "record_id": log.record.id,
                "action": log.action,
                "time": log.accessed_at
            }
            for log in logs
        ]
        return Response(data)
    


# records/views.py
class AssignDoctorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        patient = request.user.patient
        doctor_id = request.data.get("doctor_id")

        if not doctor_id:
            return Response({"error": "doctor_id required"}, status=400)

        doctor = Doctor.objects.get(id=doctor_id)

        assignment, created = RecordAssignment.objects.get_or_create(
            patient=patient,
            doctor=doctor
        )

        return Response({
            "message": "Doctor assigned successfully"
        })

class UploadMedicalRecord(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not hasattr(request.user, "patient"):
            return Response(
                {"error": "Only patients can upload records"},
                status=403
            )

        patient = request.user.patient
        file = request.FILES.get("file")
        category = request.data.get("category", "general")

        if not file:
            return Response({"error": "No file provided"}, status=400)

        plaintext = file.read()

        record = encrypt_and_store_record(
            patient=patient,
            plaintext_data=plaintext,
            category=category,
            filename= file.name
        )

        return Response({
            "message": "Record uploaded successfully",
            "record_id": record.id,
            "category": record.category
        }, status=201)
class DoctorRecordListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        doctor = request.user.doctor
        search = request.GET.get("search")

        results = []

        keys = RecordDoctorKey.objects.filter(doctor=doctor)

        for k in keys:
            record = k.record
            patient = record.patient

            # 🔥 PDP check
            if not is_access_allowed(doctor, patient):
                continue

            # 🔎 If search exists → filter by username
            if search:
                if search.lower() not in patient.name.lower():
                    continue

            results.append({
                "record_id": record.id,
                "patient_name": patient.name,
                "filename": record.original_filename,   # 👈 ADD THIS
                "uploaded_at": record.created_at,
            })

        return Response(results)      
class PatientRecordsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        patient = request.user.patient

        records = MedicalRecord.objects.filter(patient=patient)

        return Response([
            {
                "id": r.id,
                "filename": r.original_filename ,
                "category": r.category,
                "uploaded_at": r.created_at
            }
            for r in records
        ])

class PatientViewRecord(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, record_id):
        # Ensure user is a patient
        if not hasattr(request.user, "patient"):
            return Response({"error": "Only patients can view this"}, status=403)

        patient = request.user.patient

        try:
            record = MedicalRecord.objects.get(id=record_id, patient=patient)
        except MedicalRecord.DoesNotExist:
            return Response({"error": "Record not found"}, status=404)

        # Decrypt (patient-side)
        plaintext = decrypt_for_patient(record_id, patient)

        return Response({
            "record_id": record.id,
            "filename": record.original_filename,
            "category": record.category,
            "content": plaintext.decode(errors="ignore")
        })