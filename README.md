# Secure-Medical-Record-System
Secure, consent-based medical record management system with JWT authentication and hybrid post-quantum encryption (Kyber + AES-GCM).

🔐 Secure Medical Records System

A full-stack, consent-driven medical records management platform designed to ensure strong data confidentiality, integrity, and controlled access using modern cryptographic techniques and policy-based authorization.

📌 Overview

The Secure Medical Records System is built to protect sensitive patient health data through:

JWT-based authentication

Role-based access control (Doctor / Patient)

Consent-based authorization model (Policy Decision Point - PDP)

Hybrid post-quantum encryption (Kyber + AES-GCM)

Secure encrypted file storage

This system ensures that medical records can only be accessed when valid consent is granted, enforcing strict privacy and compliance principles.

🏗 System Architecture

The system follows a layered security model:

Authentication Layer

JWT-based token authentication using SimpleJWT

Role distinction between Doctors and Patients

Authorization Layer

Policy Decision Point (PDP) verifies active consent

Access allowed only if valid consent exists

Encryption Layer

Hybrid Encryption Model

Kyber (Post-Quantum Key Encapsulation Mechanism)

AES-GCM for symmetric encryption

Secure storage of encrypted medical files

Database Layer

MySQL for structured record management

🛠 Tech Stack
Backend

Django

Django REST Framework

SimpleJWT

MySQL

Frontend

React

Axios

Security & Cryptography

Kyber (Post-Quantum Cryptography)

AES-GCM (Authenticated Encryption)

🚀 Key Features

Patient Registration & Login

Doctor Authentication

Consent Grant & Revoke System

Secure Medical Record Upload

Encrypted File Storage

Policy-Based Access Control

JWT Token Management

Hybrid Post-Quantum Encryption

🔐 Security Model

This project implements a hybrid encryption mechanism:

Kyber is used to securely exchange symmetric keys.

AES-GCM encrypts medical files using the derived symmetric key.

Encrypted data is stored in the database.

Decryption occurs only after successful consent validation.

This ensures:

Confidentiality of medical data

Integrity through authenticated encryption

Future readiness against quantum attacks

📂 Project Structure
secure_medical_records/
│
├── backend/
│   ├── members/
│   ├── encryption/
│   ├── consent/
│   └── settings.py
│
├── frontend/
│   ├── components/
│   ├── pages/
│   └── api/
│
├── .env
├── .gitignore
└── README.md
⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/secure-medical-records.git
cd secure-medical-records
2️⃣ Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

Create .env file and configure:

SECRET_KEY=your_secret_key
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password

Run migrations:

python manage.py migrate
python manage.py runserver
3️⃣ Frontend Setup
cd frontend
npm install
npm start
