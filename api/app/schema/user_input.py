from pydantic import BaseModel,Field,field_validator,AnyUrl
from typing import Annotated
from app.config.newspapers import ALLOWED_KEYWORDS

# a pydantic model for validating the input url
class UserInputData(BaseModel):
    #define the url
    input_url :Annotated[AnyUrl,Field(...,description="The Api supports the editorial pages of The Hindu, The Time of Indian and The Indian Express.")]

    @field_validator('input_url')
    @classmethod
    def check_input_url(cls,link):
        #check if the urls are from the given newspapers
        given_url =str(link)
        if not any(keyword.lower() in given_url.lower() for keyword in ALLOWED_KEYWORDS):
            raise ValueError(f"Only the editorials from 'thehindu','indianexpress','timesofindia' will work")
        return given_url
        