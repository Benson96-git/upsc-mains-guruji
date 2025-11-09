from fastapi import FastAPI
from fastapi.responses import JSONResponse
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.document_loaders import WebBaseLoader
from schema.user_input import UserInputData


load_dotenv()

llm = ChatOpenAI()


app=FastAPI()
parser=StrOutputParser()



#human Readable
@app.get("/home")
def home():
    return(JSONResponse( status_code=200,content={'message': "This is an app that creates the UPSC based questions from teh editorical pages of the below newspapers\n"
    "1. Hindu\n"
    "2.IndianExpress\n"
    "3.Times of India"}))


#human Readable
@app.get("/sampleresult")
def result():
    return(JSONResponse( status_code=200,content=chain.invoke({'text':docs[0].page_content})))

#get the result
@app.post("/result")
def get_questions(data:UserInputData):
    input_data={'input_url':data.input_url}
    loader = WebBaseLoader(data.input_url)
    docs= loader.load()
    prompt =PromptTemplate(template="Give 10 UPSC level questions and answers from the below Text \n""{text}",
                      input_variables=['text'])
    chain= prompt | llm | parser

    try:
        chain.invoke({'text':docs[0].page_content})
    except Exception as E:
        JSONResponse(status_code=500,content=str(E))

    return(JSONResponse( status_code=200,content=chain.invoke({'text':docs[0].page_content})))

