
# crypto_engine/aes_utils.py
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def aes_encrypt(data: bytes, key: bytes):
    nonce = os.urandom(12)
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(nonce, data, None)
    return ciphertext, nonce

def aes_decrypt(ciphertext: bytes, key: bytes, nonce: bytes):
    aesgcm = AESGCM(key)
    return aesgcm.decrypt(nonce, ciphertext, None)


def wrap_key(key_to_wrap: bytes, kek: bytes):
    aesgcm = AESGCM(kek)
    nonce = os.urandom(12)
    wrapped_key = aesgcm.encrypt(nonce, key_to_wrap, None)
    return wrapped_key, nonce


def unwrap_key(wrapped_key: bytes, kek: bytes, nonce: bytes):
    aesgcm = AESGCM(kek)
    return aesgcm.decrypt(nonce, wrapped_key, None)
