# 🎓 EduChainX — Decentralized Academic Transcript Verifier
<img src="https://raw.githubusercontent.com/birukG09/EduChainX/51522bd7e97f6c997b80db710b2a2ea82bb75b2e/Screenshot_8-8-2025_0120_46c00bcc-02cf-44b1-a5f5-bead04a4cc42-00-2tdln7kxfjwap.picard.replit.dev.jpeg" width="600"/>
<img src="https://raw.githubusercontent.com/birukG09/EduChainX/522b5cbb607fdd30bde3b9c0c92f4bcf39faf370/Screenshot_8-8-2025_000_46c00bcc-02cf-44b1-a5f5-bead04a4cc42-00-2tdln7kxfjwap.picard.replit.dev.jpeg" width="600"/>

<img src="https://raw.githubusercontent.com/birukG09/EduChainX/522b5cbb607fdd30bde3b9c0c92f4bcf39faf370/Screenshot_7-8-2025_23594_46c00bcc-02cf-44b1-a5f5-bead04a4cc42-00-2tdln7kxfjwap.picard.replit.dev.jpeg" width="600"/>

<img src="https://raw.githubusercontent.com/birukG09/EduChainX/522b5cbb607fdd30bde3b9c0c92f4bcf39faf370/Screenshot_7-8-2025_235938_46c00bcc-02cf-44b1-a5f5-bead04a4cc42-00-32tdln7kxfjwap.picard.replit.dev.jpeg" width="600"/>

EduChainX is a full-stack, production-grade decentralized platform for issuing, managing, and verifying academic credentials across institutions, powered by **Solidity smart contracts**, **Rust backends**, and **Java-based tools** for institutional workflows.

> ⚡ Built for governments, universities, and employers to **securely validate academic records** on-chain and off-chain with privacy, authenticity, and auditability.

---

## 📚 Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [System Roles](#system-roles)
- [Smart Contract Overview](#smart-contract-overview)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## 🔥 Demo

Coming soon on [https://educhainx.xyz](https://educhainx.xyz)

---

## 🚀 Features

- 🔐 Immutable transcript verification on blockchain (Solidity)
- 🏛️ Multi-institution support (MOUs, registrar signing)
- 👨‍🎓 Graduate record minting (ERC-721 NFTs for degrees)
- ⚙️ Java CLI for university registrar operations
- 🧠 Rust Zero-Knowledge engine for private verification
- 🧾 PDF generation & QR validation for printed certificates
- 📊 Admin dashboard (institutional + super admin roles)
- 🔍 Employer portal for instant checks
- 📁 Document upload (e.g., scanned transcript)
- 🌐 Multilingual support + clean UI (Figma template ready)

---

## 🧰 Tech Stack

| Layer            | Technology                                 |
|------------------|--------------------------------------------|
| Smart Contracts  | Solidity (ERC721, custom access control)   |
| Verification     | Rust (ZK Engine via Arkworks / Circom)     |
| Backend Services | Rust (Actix), Java (Spring CLI & APIs)     |
| Frontend         | React + Tailwind + TypeScript              |
| Storage          | IPFS (for documents), PostgreSQL (metadata)|
| CI/CD            | GitHub Actions + Docker + Hardhat          |
| Dev Tools        | Foundry, Cargo, Gradle, Figma, Postman     |

---

## 🧱 System Architecture

```plaintext
+-------------------+       +---------------------+       +----------------------+
|   University CLI  | <---> |   EduChainX API     | <---> |     Smart Contract   |
|   (Java + Gradle) |       |   (Rust/Actix)      |       |    (Solidity/Hardhat)|
+-------------------+       +---------------------+       +----------------------+
        ^                             ^
        |                             |
        v                             v
+-------------------+       +--------------------------+
| Admin Dashboard   |       |     ZK Verifier Engine   |
| (React + Tailwind)|       |     (Rust + Arkworks)    |
+-------------------+       +--------------------------+
👥 System Roles
Role	Capabilities
Super Admin	Manage institutions, assign registrars, system config
Institution	Create academic programs, issue credentials, sign MOUs
Registrar	Upload and verify student records
Student	View/download credentials, verify ownership, share via QR
Employer	Scan QR or search by hash to verify credentials

📄 Smart Contract Overview
TranscriptNFT.sol: ERC721 contract for immutable academic credentials

InstitutionRegistry.sol: Manages universities and their signing keys

Verification.sol: Stores hashes of transcript proofs (ZK circuit outputs)

Security: Ownable, Role-based access, Pausable modifiers

🧬 Database Schema (PostgreSQL)
plaintext
Copy
Edit
institutions(id, name, eth_address, created_at)
students(id, full_name, email, university_id, wallet_address)
transcripts(id, student_id, hash, ipfs_link, status)
verifications(id, transcript_id, zk_proof_hash, verified_by)
📂 Folder Structure
plaintext
Copy
Edit
EduChainX/
├── contracts/             # Solidity smart contracts
├── zk-verifier/           # Rust-based ZK Engine (Arkworks)
├── java-cli/              # Java registrar CLI (Spring Boot)
├── frontend/              # React + Tailwind UI
├── backend/               # Rust API + PostgreSQL ORM
├── scripts/               # Deployment + DevOps scripts
├── docs/                  # Architecture + PRD + Diagrams
├── public/                # Assets, QR logos, favicon
└── README.md              # You're here!
⚙️ Installation
Clone the repo

bash
Copy
Edit
git clone https://github.com/birukG09/EduChainX.git
cd EduChainX
Install dependencies

Rust backend: cargo build

Frontend: cd frontend && npm install

Solidity: cd contracts && npm install && npx hardhat compile

Run locally

bash
Copy
Edit
# Start backend API
cd backend && cargo run

# Start frontend
cd frontend && npm run dev

# Deploy contracts
cd contracts && npx hardhat run scripts/deploy.js --network localhost
🔐 Security
Role-based smart contracts with modifiers

Multi-sig deployment setup

All document hashes + student IDs are ZK-anonymized

IPFS storage with SHA256 checksum verification

CI tests with fuzzing (via Foundry)

🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

See docs/CONTRIBUTING.md for detailed dev setup and coding guidelines.

📜 License
MIT License © 2025 Biruk Gebre
