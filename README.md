# 🧠  Flask Project Setup Guide

This project uses Flask, MongoDB, Neo4j, and a .env file to manage configuration. Each contributor should set up their own local environment using these instructions.

## Prerequisites
- Python 3.8+ installed
- MongoDB installed and running
- Neo4j installed and running
- Git installed

📁 Project Structure
```
BackEnd/
│   app.py
│   config.py
│   .env              ← each developer creates this locally (not shared)
│   requirements.txt
│   .gitignore
└───venv/             ← your virtual environment (should NOT be pushed)
```

## Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/karimysf/CabinetMedical.git
    cd CabinetMedical/BackEnd
    ```

2.  **Create and Activate a Python Virtual Environment:**
    *   **Linux/macOS:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    *   **Windows:**
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **⚠️ Create your .env file (IMPORTANT)**
    *   Create a .env file in the BackEnd/ folder (same directory as app.py), and add your own local database settings:
    ```env
        # MongoDB settings
        MONGO_URI=mongodb://localhost:27017/CabinetDB

        # Neo4j settings
        NEO4J_URI=bolt://localhost:7687
        NEO4J_USER=neo4j
        NEO4J_PASSWORD=rootroot

        # Debug mode
        DEBUG=True
    ```

5. **Verify Installation:**
   ```bash
   python app.py
   ```
   You should see Flask starting up without errors.

## Troubleshooting

- **MongoDB connection errors:** Ensure MongoDB is running by starting the MongoDB service:
  ```bash
  mongod
  ```
- **Neo4j connection fails:** Check if Neo4j is running and credentials are correct. Start Neo4j service and verify your username/password
- **Virtual environment issues:** Make sure you've activated your virtual environment before installing dependencies
- **Module not found errors:** Ensure you're in the correct directory and have installed all requirements:
  ```bash
  pip install -r requirements.txt
