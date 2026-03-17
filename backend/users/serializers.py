from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Patient, Doctor
from django.contrib.auth.hashers import make_password

class DoctorRegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    name = serializers.CharField()
    department = serializers.CharField()
    license_no = serializers.CharField()
    
class PatientRegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    name = serializers.CharField()
    age = serializers.IntegerField()
    phone = serializers.CharField()