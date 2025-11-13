import asyncio
import pymongo
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

uri= os.getenv("DATABASE_URL")

class DunduDb():
    
    def __init__(self, uri=uri, db_name="upsc"):
        # connect to MongoDB
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db["questionnaire"]
        

    # def insert_to_db(self,file):
    #     try:
    #         result=  self.collection.insert_one(file)
    #     except Exception as e:
    #         print(e)

    def insert_to_db(self, file: dict):
        try:
            result = self.collection.insert_one(file)
            # ✅ Return the inserted_id as a string to avoid JSON serialization issues
            inserted_id = str(result.inserted_id)
            print(f"Inserted document with _id: {inserted_id}")
            return inserted_id
        except Exception as e:
            print(f"Error inserting document: {e}")
            return None


        

        
    def check_db(self,url):

        # results =  self.collection.find_one({'url': url})
        doc = self.collection.find_one({"url": url},{"_id": 0, "qa_pairs": 1})

        return doc