from fastapi import FastAPI
from fastapi.responses import JSONResponse
from schema.user_input import UserInputData
from core.logger import logger
from src.model import generate_questions
from schema.model_output import QAResponse

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
@app.post("/result",response_model=QAResponse)
def get_questions(data:UserInputData):
    logger.info("get_questions endpoint was called")
    input_data={'input_url':data.input_url}
    logger.debug(f"Received payload: {input_data}")
    

    try:
        output=generate_questions(input_data)

    except Exception as E:
        return(JSONResponse(status_code=500,content=str(E)))

    return(JSONResponse( status_code=200,content=output.dict()))

