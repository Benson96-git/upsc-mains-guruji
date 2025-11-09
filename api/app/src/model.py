from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_community.document_loaders import WebBaseLoader
from schema.user_input import UserInputData
from core.logger import logger
from schema.model_output import QAResponse

#load the environment variables
load_dotenv()

llm =HuggingFaceEndpoint(    
    repo_id="meta-llama/Llama-3.3-70B-Instruct",
    task="text-generation")

#load the  model
# model = ChatOpenAI()
model= ChatHuggingFace(llm=llm)




def generate_questions(input_data:UserInputData):

    
    #Initialize the output parsers
    parser=PydanticOutputParser(pydantic_object=QAResponse)
    #Fetch the details from the input URL  using the webbase model
    loader = WebBaseLoader(str(input_data['input_url']))

    #load the details to the document
    docs= loader.load()

    #prepare the Dyanamic prompt 
    prompt =PromptTemplate(template="Give 10 UPSC level questions and answers from the below Text \n""{text}. The questions should be explained properly.please do not return questions that ends with ' according to the given text?' .Return ONLY valid JSON in this format: {format_instructions}",
                    input_variables=['text'],partial_variables={"format_instructions": parser.get_format_instructions()})    
    #Initialize the chain
    chain= prompt | model | parser

    #invoke the chain with the inputvariables
    output=chain.invoke({'text':docs[0].page_content})

    #Return the result
    return (output)