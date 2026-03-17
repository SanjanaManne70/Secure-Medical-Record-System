from django.urls import path
from .views import GrantDoctorConsent, MyDoctorsView, RevokeDoctorConsent

urlpatterns = [
    path("grant/", GrantDoctorConsent.as_view()),
    path("revoke/", RevokeDoctorConsent.as_view()),
    path("my-doctors/", MyDoctorsView.as_view()),
    
]
