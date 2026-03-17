import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from hashlib import sha256

VAULT_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../secure_vault")
)

MASTER_KEY = os.getenv("KEY_VAULT_MASTER_KEY")
if not MASTER_KEY:
    raise EnvironmentError("KEY_VAULT_MASTER_KEY not set")

MASTER_KEY_BYTES = sha256(MASTER_KEY.encode()).digest()


def _get_vault_path(doctor_id: int) -> str:
    return os.path.join(VAULT_DIR, f"doctor_{doctor_id}.key.enc")


def store_private_key(doctor_id: int, private_key_bytes: bytes):
    aesgcm = AESGCM(MASTER_KEY_BYTES)
    nonce = os.urandom(12)
    encrypted_key = aesgcm.encrypt(nonce, private_key_bytes, None)

    with open(_get_vault_path(doctor_id), "wb") as f:
        f.write(nonce + encrypted_key)


def load_private_key(doctor_id: int) -> bytes:
    with open(_get_vault_path(doctor_id), "rb") as f:
        data = f.read()

    nonce = data[:12]
    encrypted_key = data[12:]

    aesgcm = AESGCM(MASTER_KEY_BYTES)
    private_key_bytes = aesgcm.decrypt(nonce, encrypted_key, None)
    return private_key_bytes
