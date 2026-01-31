# Version Control System

A lightweight, custom-built **Version Control System (VCS)** designed to simulate core versioning workflows such as tracking changes, committing versions, and storing file history using cloud storage.

This project focuses on understanding the internal mechanics of version control systems while integrating real-world tools like **AWS S3** and CLI utilities.

---

## Introduction

The Version Control System enables users to manage versions of files through a command-line interface. It allows tracking changes over time, committing updates with messages, and storing versions remotely for reliability and scalability.

The system is built to be minimal yet extensible, making it suitable for learning, experimentation, and further enhancement.

---

## Tech Stack

### Core Technologies

* **Node.js** – Runtime environment
* **JavaScript (ES6+)** – Application logic
* **AWS S3** – Remote storage for versioned files

### CLI & Utilities

* **yargs** – Command-line argument parsing
* **fs** – File system operations
* **path** – File and directory handling
* **crypto** – Hash generation for versioning

---

## Libraries & Services Used

| Tool / Service    | Purpose                              |
| ----------------- | ------------------------------------ |
| `yargs`           | CLI command handling                 |
| `aws-sdk`         | Interacting with AWS S3              |
| `fs`              | Reading and writing files            |
| `path`            | File path resolution                 |
| `crypto`          | Commit hash generation               |
| **AWS S3 Bucket** | Persistent storage for file versions |

---

## Architecture

<img width="3600" height="3608" alt="mermaid-diagram" src="https://github.com/user-attachments/assets/0fa4eb07-6116-4f9f-8346-0e4a4df81d12" />

```text
[ CLI Commands ]
        ↓
[ VCS Core Logic ]
        ↓
[ Local Metadata ]
        ↓
[ AWS S3 Bucket ]
```

---

## Key Concepts Implemented

* File tracking
* Commit-based versioning
* Hash-based identification
* Remote storage using cloud services
* CLI-driven workflow

---

## Getting Started

### Prerequisites

* Node.js
* AWS account
* Configured S3 bucket
* AWS credentials set locally

### Installation

```bash
git clone https://github.com/Adi19052005/version-control-system.git
cd version-control-system
npm install
```

---

## Configuration

Set your AWS credentials using environment variables:

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
```

---

## Usage

```bash
node index.js <command> [options]
```

Example:

```bash
node index.js init
node index.js add file.txt
node index.js commit -m "Initial commit"
```

*(Add or modify commands based on your implementation)*

---

## Future Enhancements

* Branching support
* Diff comparison
* Rollback support
* Authentication
* Web dashboard

---
