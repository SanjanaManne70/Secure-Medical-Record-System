from django.urls import path
from .views import  DeleteRecord, PatientRecordsView, RenameRecord, ViewMedicalRecord,PatientViewRecord
from .views import AssignDoctorView
from .views import UploadMedicalRecord
from .views import DoctorRecordListView


urlpatterns = [
    path('view/<int:record_id>/', ViewMedicalRecord.as_view()),
    path("upload/", UploadMedicalRecord.as_view()),
    path("assign-doctor/", AssignDoctorView.as_view()),
    path("doctor-records/", DoctorRecordListView.as_view()),
    path("patient-records/", PatientRecordsView.as_view()),  
    path("patient/view/<int:record_id>/", PatientViewRecord.as_view()),
    path("rename/<int:record_id>/", RenameRecord.as_view()),
    path("delete/<int:record_id>/", DeleteRecord.as_view()),

]
