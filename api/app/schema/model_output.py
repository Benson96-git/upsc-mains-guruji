from pydantic import BaseModel,Field
from typing import List,Annotated,Optional

#pydantic model to verify the llm output
class QA(BaseModel):    
    question:Annotated[str,Field(description='This is the question and it should be numbered')]
    answer: Annotated[str,Field(description='This is the answer to the question with a prefix Answer:')]

class QAResponse(BaseModel):
    url:Annotated[Optional[str],Field(description="This is just for adding in the db, return the url alone")]
    qa_pairs: Annotated[List[QA],Field(description='This is the pair of question and answer')]