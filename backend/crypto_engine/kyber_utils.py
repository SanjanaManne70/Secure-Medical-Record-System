# crypto_engine/kyber_utils.py
from oqs import KeyEncapsulation
from hashlib import sha256

KEM_ALGO = "Kyber768"


def generate_kyber_keypair():
    """
    Generates Kyber public/private keypair
    """
    kem = KeyEncapsulation(KEM_ALGO)
    public_key = kem.generate_keypair()
    private_key = kem.export_secret_key()
    return public_key, private_key


def kyber_encrypt_key(public_key: bytes):
    """
    Encapsulate shared secret using Kyber
    """
    kem = KeyEncapsulation(KEM_ALGO)
    ciphertext, shared_secret = kem.encap_secret(public_key)

    return ciphertext, shared_secret


def kyber_decrypt_key(private_key: bytes, ciphertext: bytes):
    """
    Decapsulate shared secret using Kyber
    """
    kem = KeyEncapsulation(
        KEM_ALGO,
        secret_key=private_key
    )
    shared_secret = kem.decap_secret(ciphertext)
    return shared_secret
