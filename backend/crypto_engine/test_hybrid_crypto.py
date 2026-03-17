from kyber_utils import (
    generate_kyber_keypair,
    kyber_encrypt_key,
    kyber_decrypt_key,
)
from aes_utils import aes_encrypt, aes_decrypt
from hashlib import sha256

def main():
    print("🔐 Generating Kyber key pair (Doctor)...")
    public_key, private_kem = generate_kyber_keypair()

    print("🔑 Encapsulating shared secret using Kyber...")
    encrypted_key, shared_secret_enc = kyber_encrypt_key(public_key)

    print("🔓 Decapsulating shared secret using Kyber...")
    shared_secret_dec = kyber_decrypt_key(private_kem, encrypted_key)

    assert shared_secret_enc == shared_secret_dec
    print("✅ Kyber key exchange successful")

    print("🔁 Deriving AES-256 key from shared secret...")
    aes_key = sha256(shared_secret_enc).digest()

    print("📄 Encrypting medical file using AES-256-GCM...")
    medical_data = b"Patient diagnosis: All values normal."
    encrypted_data, nonce = aes_encrypt(medical_data, aes_key)

    print("📂 Decrypting medical file...")
    decrypted_data = aes_decrypt(encrypted_data, aes_key, nonce)

    assert decrypted_data == medical_data
    print("✅ AES encryption/decryption successful")

    print("\n🎉 HYBRID POST-QUANTUM ENCRYPTION WORKING PERFECTLY 🎉")

if __name__ == "__main__":
    main()
