from django.db import transaction
from users.models import Doctor
from crypto_engine.kyber_utils import generate_kyber_keypair


@transaction.atomic
def register_doctor(user, name: str):
    """
    Registers a doctor and generates Kyber key pair
    """

    # 🔐 Generate Kyber keypair
    public_key, private_key = generate_kyber_keypair()

    # 👨‍⚕️ Create Doctor entry
    doctor = Doctor.objects.create(
        user=user,
        name=name,
        public_kyber_key=public_key,
        private_kyber_key=private_key
    )

    return doctor
