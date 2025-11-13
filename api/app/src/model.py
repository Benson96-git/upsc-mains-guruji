from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace,HuggingFacePipeline
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_community.document_loaders import WebBaseLoader
from app.schema.user_input import UserInputData
from app.core.logger import logger
from app.schema.model_output import QAResponse

#load the environment variables
load_dotenv()



# llm= HuggingFacePipeline.from_model_id(model_id="meta-llama/Llama-3.3-70B-Instruct", task="text-generation")



class GetFromLlm():
    def __init__(self):
        #initialisze the model
        self.llm =HuggingFaceEndpoint(    
        repo_id="meta-llama/Llama-3.3-70B-Instruct",
        task="text-generation")

        #load the  model
        self.model = ChatOpenAI()
        # model= ChatHuggingFace(llm=self.llm)


    def generate_questions(self,input_data:UserInputData):

        
        #Initialize the output parsers
        parser=PydanticOutputParser(pydantic_object=QAResponse)
        #Fetch the details from the input URL  using the webbase model
        loader = WebBaseLoader(str(input_data['input_url']))

        #load the details to the document
        docs= loader.load()

        #prepare the Dyanamic prompt 
        prompt =PromptTemplate(template="Give 10 UPSC level questions and answers from the below Text \n""{text}. The questions should be explained properly.please do not return questions that ends with ' according to the given text?' .Return ONLY valid JSON in this format: {format_instructions}. The url is  the url of the page: {url}",
                        input_variables=['text','url'],partial_variables={"format_instructions": parser.get_format_instructions()})    
        #Initialize the chain
        chain= prompt | self.model | parser

        #invoke the chain with the inputvariables
        output=chain.invoke({'text':docs[0].page_content,'url':str(input_data['input_url'])})

        #Return the result
        return (output)