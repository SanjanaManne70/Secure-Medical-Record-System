from key_vault import store_private_key, load_private_key

def main():
    doctor_id = 101
    fake_private_key = b"THIS_IS_A_TEST_PRIVATE_KEY"

    print("🔐 Storing private key in vault...")
    store_private_key(doctor_id, fake_private_key)

    print("🔓 Loading private key from vault...")
    loaded_key = load_private_key(doctor_id)

    assert loaded_key == fake_private_key
    print("✅ Secure key vault working correctly")

if __name__ == "__main__":
    main()
