# services/db.py

from flask_pymongo import PyMongo
from neo4j import GraphDatabase

mongo = None
neo4j_driver = None
