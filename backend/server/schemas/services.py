from typing import List, Optional
from pydantic import BaseModel

from server.schemas import SpecieSchema, UserSchema, PetSchema, NotificationWithPetSchema, CodeSchema, LocationSchema

class RefreshTokenPayload(BaseModel):
  token: str
  refresh_token: str

class RefreshTokenResponse(BaseModel):
  data: RefreshTokenPayload

class GoogleOAuthBody(BaseModel):
  token: str

class OAuthGooglePayload(BaseModel):
  token: str
  refresh_token: str

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

class PetByIdResponse(BaseModel):
  data: PetSchema

class PetCodesResponse(BaseModel):
  data: List[CodeSchema]

class PetLocationsResponse(BaseModel):
  data: List[LocationSchema]

class CreatePetSchema(BaseModel):
  data: PetSchema