# config.py
#Configuration MongoDB
import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI")
    NEO4J_URI = os.getenv("NEO4J_URI")
    NEO4J_USER = os.getenv("NEO4J_USER")
    NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
