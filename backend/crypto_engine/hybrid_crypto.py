import os
import hashlib
import oqs
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

KEM_ALGO = "Kyber768"


def _derive_aes_key(shared_secret: bytes) -> bytes:
    return hashlib.sha256(shared_secret).digest()


# ===============================
# ENCRYPT (PATIENT → DOCTORS)
# ===============================

def hybrid_encrypt_for_doctors(plaintext: bytes, doctors):
    """
    Encrypt data ONCE with AES-256-GCM
    Wrap AES key separately for each doctor using Kyber
    """

    # 1️⃣ Generate AES key
    aes_key = os.urandom(32)

    # 2️⃣ Encrypt record once
    nonce = os.urandom(12)
    aesgcm = AESGCM(aes_key)
    encrypted_data = aesgcm.encrypt(nonce, plaintext, None)

    wrapped_keys = {}

    # 3️⃣ Wrap AES key per doctor
    for doctor in doctors:
        if not doctor.public_kyber_key:
            raise ValueError(f"Doctor {doctor.id} missing Kyber public key")

        with oqs.KeyEncapsulation(KEM_ALGO) as kem:
            kyber_ct, shared_secret = kem.encap_secret(
                doctor.public_kyber_key
            )

        wrap_key = _derive_aes_key(shared_secret)
        wrap_nonce = os.urandom(12)
        wrap_gcm = AESGCM(wrap_key)

        wrapped_aes_key = wrap_gcm.encrypt(wrap_nonce, aes_key, None)

        wrapped_keys[doctor.id] = {
            "kyber_ciphertext": kyber_ct,
            "wrapped_aes_key": wrapped_aes_key,
            "wrap_nonce": wrap_nonce,
        }

    return {
        "encrypted_data": encrypted_data,
        "nonce": nonce,
        "wrapped_keys": wrapped_keys,
        "aes_key": aes_key,  # 👈 return this for patient wrapping
    }


# ===============================
# DECRYPT (DOCTOR ACCESS)
# ===============================

def hybrid_decrypt_for_doctor(
    encrypted_data: bytes,
    nonce: bytes,
    wrapped_aes_key: bytes,
    kyber_ciphertext: bytes,
    wrap_nonce: bytes,
    private_kyber_key: bytes,   # 👈 ADD THIS
):
    """
    Doctor decrypts AES key via Kyber, then decrypts record
    """

    # 1️⃣ Kyber decapsulation
    with oqs.KeyEncapsulation(
        KEM_ALGO,
        secret_key=private_kyber_key
    ) as kem:
        shared_secret = kem.decap_secret(kyber_ciphertext)

    wrap_key = _derive_aes_key(shared_secret)

    # 2️⃣ Unwrap AES key
    wrap_gcm = AESGCM(wrap_key)
    aes_key = wrap_gcm.decrypt(wrap_nonce, wrapped_aes_key, None)

    # 3️⃣ Decrypt record
    aesgcm = AESGCM(aes_key)
    plaintext = aesgcm.decrypt(nonce, encrypted_data, None)

    return plaintext
def generate_kyber_keypair():
    with oqs.KeyEncapsulation(KEM_ALGO) as kem:
        public_key = kem.generate_keypair()
        private_key = kem.export_secret_key()
    return public_key, private_key