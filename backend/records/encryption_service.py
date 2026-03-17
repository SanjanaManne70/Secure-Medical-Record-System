from django.db import transaction
from records.models import MedicalRecord, RecordDoctorKey
from crypto_engine.hybrid_crypto import hybrid_encrypt_for_doctors
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from consent.models import DoctorConsent

import os

@transaction.atomic
def encrypt_and_store_record(patient, plaintext_data, category, filename):

   # 1️⃣ Fetch doctors with ACTIVE consent
    consents = DoctorConsent.objects.filter(
        patient=patient,
        is_active=True
    )

    if not consents.exists():
        raise ValueError("No doctors with active consent")

    doctors = [c.doctor for c in consents]

    # 2️⃣ Ensure doctors have Kyber keys
    for d in doctors:
        if not d.public_kyber_key:
            raise ValueError(f"Doctor {d.id} has no Kyber public key")

    # 3️⃣ Encrypt once + wrap per doctor (existing logic)
    enc = hybrid_encrypt_for_doctors(plaintext_data, doctors)

    encrypted_data = enc["encrypted_data"]
    nonce = enc["nonce"]
    aes_key = enc["aes_key"]   # 👈 make sure your hybrid function returns this

    # 4️⃣ Wrap AES key for PATIENT (NEW 🔥)
    patient_aesgcm = AESGCM(patient.master_key)
    patient_wrap_nonce = os.urandom(12)

    patient_wrapped_key = patient_aesgcm.encrypt(
        patient_wrap_nonce,
        aes_key,
        None
    )

    # 5️⃣ Store encrypted record
    record = MedicalRecord.objects.create(
        patient=patient,
        encrypted_data=encrypted_data,
        nonce=nonce,
        category=category,
        original_filename=filename,
        patient_wrapped_key=patient_wrapped_key,
        patient_wrap_nonce=patient_wrap_nonce,
    )

    # 6️⃣ Store wrapped AES keys for doctors (existing logic)
    for doctor in doctors:
        payload = enc["wrapped_keys"][doctor.id]

        RecordDoctorKey.objects.create(
            record=record,
            doctor=doctor,
            wrapped_aes_key=payload["wrapped_aes_key"],
            kyber_ciphertext=payload["kyber_ciphertext"],
            wrap_nonce=payload["wrap_nonce"],
        )

    return record