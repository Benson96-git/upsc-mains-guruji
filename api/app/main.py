from fastapi import FastAPI
from fastapi.responses import JSONResponse
from schema.user_input import UserInputData
from core.logger import logger
from src.model import generate_questions
from schema.model_output import QAResponse
from db.solved_question import DunduDb
from bson import json_util
app=FastAPI()



#human Readable
@app.get("/home")
def home():
    logger.info("Home endpoint was called")
    return(JSONResponse( status_code=200,content={'message': "This is an app that creates the UPSC based questions from teh editorical pages of the below newspapers\n"
    "1. Hindu\n"
    "2.IndianExpress\n"
    "3.Times of India"}))




#get the result
@app.post("/result")#,response_model=QAResponse)
async def get_questions(data:UserInputData):
    db= DunduDb()

    
    input_data={'input_url':data.input_url}
    logger.debug(f"Received payload: {input_data}")
    
    db_output=db.check_db(data.input_url)

    if db_output:
        return(JSONResponse( status_code=200,content=db_output)   ) 
    
    else:
        try:
            output=generate_questions(input_data)
            logger.info("get_questions endpoint was called")
            output = output.dict()
            # output = json.loads(output)
            test=output.copy()
            #insert the data to db
            db.insert_to_db(output)
            
            del test["url"] 

        except Exception as E:
            print(f"error:{E}")
            return(JSONResponse(status_code=500,content=str(E)))
        return (JSONResponse( status_code=200,content=test)) 

