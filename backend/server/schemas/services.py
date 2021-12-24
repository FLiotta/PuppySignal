from typing import List, Optional
from pydantic import BaseModel

from server.schemas import SpecieSchema, UserSchema, PetSchema, NotificationWithPetSchema

class GoogleOAuthBody(BaseModel):
  token: str

class OAuthGooglePayload(BaseModel):
  token: str

class OAuthGoogleResponse(BaseModel):
  data: OAuthGooglePayload

class DataSpeciesResponse(BaseModel):
  data: List[SpecieSchema]

class ProfileResponse(BaseModel):
  data: UserSchema

class ProfilePatchBody(BaseModel):
  first_name: Optional[str]
  last_name: Optional[str]
  birthday: Optional[str]

class ProfilePetsResponse(BaseModel):
  data: List[PetSchema]

class PhoneNumberBody(BaseModel):
  phone_number: str

class PhoneNumberVerifyBody(BaseModel):
  phone_number: str
  code: int 

class CreatePetBody(BaseModel):
  name: str
  description: str
  specie_id: int

class ScannedQRCodeResponse(BaseModel):
  data: PetSchema

class ProfileNotificationsResponse(BaseModel):
  data: List[NotificationWithPetSchema]