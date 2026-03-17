from records.models import MedicalRecord, RecordDoctorKey
from policy_engine.pdp import is_access_allowed
from crypto_engine.hybrid_crypto import hybrid_decrypt_for_doctor
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def decrypt_for_patient(record_id, patient):
    record = MedicalRecord.objects.get(id=record_id, patient=patient)

    # 1️⃣ Unwrap AES key
    patient_aesgcm = AESGCM(patient.master_key)

    aes_key = patient_aesgcm.decrypt(
        record.patient_wrap_nonce,
        record.patient_wrapped_key,
        None
    )

    # 2️⃣ Decrypt record
    aesgcm = AESGCM(aes_key)

    plaintext = aesgcm.decrypt(
        record.nonce,
        record.encrypted_data,
        None
    )

    return plaintext

def decrypt_and_load_record(record_id, doctor):
    # 1️⃣ Fetch record
    record = MedicalRecord.objects.get(id=record_id)
    patient = record.patient

    # 2️⃣ PDP enforcement (CRITICAL 🔥)
    if not is_access_allowed(doctor, patient):
        raise PermissionError("Access denied by policy")

    # 3️⃣ Fetch doctor-specific wrapped AES key
    enc_key = RecordDoctorKey.objects.get(
        record=record,
        doctor=doctor
    )

    # 4️⃣ Decrypt (Kyber → AES)
    plaintext = hybrid_decrypt_for_doctor(
        encrypted_data=record.encrypted_data,
        nonce=record.nonce,
        kyber_ciphertext=enc_key.kyber_ciphertext,
        wrapped_aes_key=enc_key.wrapped_aes_key,
        wrap_nonce=enc_key.wrap_nonce,
        private_kyber_key=doctor.private_kyber_key,  # ✅ REAL KEY
    )

    return plaintext


def decrypt_for_patient(record_id, patient):
    record = MedicalRecord.objects.get(id=record_id, patient=patient)

    # 1️⃣ Unwrap AES key
    patient_aesgcm = AESGCM(patient.master_key)

    aes_key = patient_aesgcm.decrypt(
        record.patient_wrap_nonce,
        record.patient_wrapped_key,
        None
    )

    # 2️⃣ Decrypt record
    aesgcm = AESGCM(aes_key)

    plaintext = aesgcm.decrypt(
        record.nonce,
        record.encrypted_data,
        None
    )

    return plaintext