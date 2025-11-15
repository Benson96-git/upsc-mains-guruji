import asyncio
import pymongo
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# load_dotenv()

uri= os.getenv("DATABASE_URL")

class DunduDb():

    #intialize the connection
    def __init__(self, uri=uri, db_name="upsc"):
        # connect to MongoDB
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db["questionnaire"]
        
    #connect to the db and insert the results to the db
    def insert_to_db(self, file):
        try:
            result = self.collection.insert_one(file)

            # inserted id is returned
            inserted_id = str(result.inserted_id)

            #return the 
            return inserted_id
        except Exception as e:
            print(f"Error inserting document: {e}")
            return None
        
    def check_db(self,url):

        # results =  self.collection.find_one({'url': url})
        doc = self.collection.find_one({"url": url},{"_id": 0, "qa_pairs": 1})

        return doc