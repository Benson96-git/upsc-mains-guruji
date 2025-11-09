from fastapi import FastAPI
from fastapi.responses import JSONResponse
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_community.document_loaders import WebBaseLoader
from schema.user_input import UserInputData
from core.logger import logger
from schema.model_output import QAResponse


load_dotenv()

llm = ChatOpenAI()


app=FastAPI()
parser=PydanticOutputParser(pydantic_object=QAResponse)



#human Readable
@app.get("/home")
def home():
    logger.info("Home endpoint was called")
    return(JSONResponse( status_code=200,content={'message': "This is an app that creates the UPSC based questions from teh editorical pages of the below newspapers\n"
    "1. Hindu\n"
    "2.IndianExpress\n"
    "3.Times of India"}))


#human Readable
@app.get("/sampleresult")
def result():
    return(JSONResponse( status_code=200,content=chain.invoke({'text':docs[0].page_content})))

#get the result
@app.post("/result",response_model=QAResponse)
def get_questions(data:UserInputData):
    logger.info("get_questions endpoint was called")
    input_data={'input_url':data.input_url}
    logger.debug(f"Received payload: {input_data}")
    

    try:
        loader = WebBaseLoader(str(data.input_url))
        docs= loader.load()
        prompt =PromptTemplate(template="Give 10 UPSC level questions and answers from the below Text \n""{text} Return ONLY valid JSON in this format: {format_instructions}",
                      input_variables=['text'],partial_variables={"format_instructions": parser.get_format_instructions()})
        chain= prompt | llm | parser
        output=chain.invoke({'text':docs[0].page_content})
    except Exception as E:
        return(JSONResponse(status_code=500,content=str(E)))

    return(JSONResponse( status_code=200,content=output.dict()))

