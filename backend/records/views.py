from users.models import Doctor
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from records.encryption_service import encrypt_and_store_record
from records.decryption_service import decrypt_and_load_record, decrypt_for_patient
from records.models import (
    MedicalRecord,
    AccessAuditLog,
    RecordAssignment,
    RecordDoctorKey
)
from policy_engine.pdp import is_access_allowed
import mimetypes


# 🔥 HELPER: GET CLIENT IP
def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0]
    return request.META.get("REMOTE_ADDR")


# 🔥 DOCTOR VIEW RECORD (WITH AUDIT LOG)
class ViewMedicalRecord(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, record_id):
        try:
            doctor = request.user.doctor

            # 🔐 decrypt
            plaintext = decrypt_and_load_record(record_id, doctor)

            # 📄 get record info
            record = MedicalRecord.objects.get(id=record_id)
            filename = record.original_filename

            # 🔍 detect content type
            content_type, _ = mimetypes.guess_type(filename)
            if not content_type:
                content_type = "application/octet-stream"

            # 🧾 AUDIT LOG
            AccessAuditLog.objects.create(
                doctor=doctor,
                patient=record.patient,
                record=record,
                action="VIEW",
                purpose="Doctor accessed medical record",
                ip_address=get_client_ip(request)
            )

            # 📦 return file
            response = HttpResponse(plaintext, content_type=content_type)
            response["Content-Disposition"] = f'inline; filename="{filename}"'

            return response

        except PermissionError:
            return Response({"error": "Access denied"}, status=403)

        except Exception as e:
            print("DECRYPT ERROR:", str(e))
            return Response({"error": "Failed to decrypt"}, status=500)


# 🔍 PATIENT AUDIT LOGS
class PatientAuditLogs(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logs = AccessAuditLog.objects.filter(
            patient=request.user.patient
        ).order_by("-accessed_at")

        data = [
            {
                "doctor": log.doctor.name if log.doctor else "Self",
                "record_id": log.record.id,
                "action": log.action,
                "purpose": log.purpose,
                "ip": log.ip_address,
                "time": log.accessed_at.strftime("%d-%m-%Y %H:%M:%S")  # ✅ FIX
            }
            for log in logs
        ]
        return Response(data)


# 👨‍⚕️ ASSIGN DOCTOR
class AssignDoctorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        patient = request.user.patient
        doctor_id = request.data.get("doctor_id")

        if not doctor_id:
            return Response({"error": "doctor_id required"}, status=400)

        doctor = Doctor.objects.get(id=doctor_id)

        RecordAssignment.objects.get_or_create(
            patient=patient,
            doctor=doctor
        )

        return Response({"message": "Doctor assigned successfully"})


# 📤 UPLOAD RECORD (ENCRYPT)
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
            filename=file.name
        )

        return Response({
            "message": "Record uploaded successfully",
            "record_id": record.id,
            "category": record.category
        }, status=201)


# 📋 DOCTOR RECORD LIST
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

            # 🔎 search filter
            if search and search.lower() not in patient.name.lower():
                continue

            results.append({
                "record_id": record.id,
                "patient_name": patient.name,
                "filename": record.original_filename,
                "uploaded_at": record.created_at,
            })

        return Response(results)


# 📋 PATIENT RECORD LIST
class PatientRecordsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        patient = request.user.patient

        records = MedicalRecord.objects.filter(patient=patient)

        return Response([
            {
                "id": r.id,
                "filename": r.original_filename,
                "category": r.category,
                "uploaded_at": r.created_at
            }
            for r in records
        ])


# 🔥 PATIENT VIEW RECORD (WITH AUDIT LOG)
class PatientViewRecord(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, record_id):
        if not hasattr(request.user, "patient"):
            return Response({"error": "Only patients can view"}, status=403)

        patient = request.user.patient

        try:
            record = MedicalRecord.objects.get(id=record_id, patient=patient)

            plaintext = decrypt_for_patient(record_id, patient)

            filename = record.original_filename

            content_type, _ = mimetypes.guess_type(filename)
            if not content_type:
                content_type = "application/octet-stream"

            # 🧾 AUDIT LOG
            AccessAuditLog.objects.create(
                doctor=None,
                patient=patient,
                record=record,
                action="VIEW",
                purpose="Patient viewed own record",
                ip_address=get_client_ip(request)
            )

            response = HttpResponse(plaintext, content_type=content_type)
            response["Content-Disposition"] = f'inline; filename="{filename}"'

            return response

        except MedicalRecord.DoesNotExist:
            return Response({"error": "Record not found"}, status=404)

        except Exception as e:
            print("PATIENT DECRYPT ERROR:", str(e))
            return Response({"error": "Failed to decrypt"}, status=500)
        


class RenameRecord(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, record_id):
        patient = request.user.patient
        new_name = request.data.get("filename")

        try:
            record = MedicalRecord.objects.get(id=record_id, patient=patient)
            record.original_filename = new_name
            record.save()

            return Response({"message": "Renamed successfully"})
        except MedicalRecord.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        

class DeleteRecord(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, record_id):
        patient = request.user.patient

        try:
            record = MedicalRecord.objects.get(id=record_id, patient=patient)
            record.delete()

            return Response({"message": "Deleted successfully"})
        except MedicalRecord.DoesNotExist:
            return Response({"error": "Not found"}, status=404)