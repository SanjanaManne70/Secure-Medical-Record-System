#backend/users/urls.py
from django.urls import path
from .views import DoctorListView, DoctorRegisterView, MeView, MyDoctorsView, PatientRegisterView, RemoveDoctorView, AddDoctorView
from .auth_views import DoctorTokenView

urlpatterns = [
    path('register/', DoctorRegisterView.as_view()),
    path('login/', DoctorTokenView.as_view()),
    path('', DoctorListView.as_view()),   # 👈 NEW
    path("my-doctors/", MyDoctorsView.as_view()),
    path('register/doctor/', DoctorRegisterView.as_view()),
    path('register/patient/', PatientRegisterView.as_view()),
    path('me/', MeView.as_view()),
    path('add-doctor/', AddDoctorView.as_view()),
    path('remove-doctor/', RemoveDoctorView.as_view()),
]
