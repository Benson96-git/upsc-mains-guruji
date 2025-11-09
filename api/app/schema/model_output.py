from pydantic import BaseModel,Field
from typing import List,Annotated

class QA(BaseModel):
    question:Annotated[str,Field(description='This is the question and it should be numbered')]
    answer: Annotated[str,Field(description='This is the answer to the question with a prefix Answer:')]

class QAResponse(BaseModel):
    qa_pairs: Annotated[List[QA],Field(description='This is the pair of question and answer')]