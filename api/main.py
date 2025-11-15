from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.schema.user_input import UserInputData
from app.core.logger import logger
from app.src.model import GetFromLlm
from app.schema.model_output import QAResponse
from app.db.solved_question import DunduDb

#intialize FastAPI
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
    #initialize db
    db= DunduDb()

    #initialize llm
    llm=GetFromLlm()

    #load the input url to a dictionary
    input_data={'input_url':data.input_url}
    
    logger.debug(f"Received payload: {input_data}")
    
    #Check if the Url data is already present in the db
    db_output=db.check_db(data.input_url)

    #if yes return the saved result
    if db_output:
        return(JSONResponse( status_code=200,content=db_output)   ) 
    
    #else use the llm to generate questions for you
    else:
        try:
            #genereating question
            output=llm.generate_questions(input_data)
            logger.info("get_questions endpoint was called")

            #output value is saved as dictionary
            output = output.dict()
            
            #a copy of the result is saved to a variable
            result=output.copy()

            #insert the data to db
            db.insert_to_db(output)
            
            #delete the url from the result
            del result["url"] 

        except Exception as E:
            #print the error id there are any
            print(f"error:{E}")
            return(JSONResponse(status_code=500,content=str(E)))
        
        #return the desired output.
        return (JSONResponse( status_code=200,content=result)) 

