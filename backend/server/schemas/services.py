from typing import List, Optional
from pydantic import BaseModel

from server.schemas import (
    SpecieSchema,
    UserSchema,
    PetSchema,
    NotificationWithPetSchema,
    CodeSchema,
    LocationSchema,
)


class RefreshTokenPayload(BaseModel):
    access_token: str


class RefreshTokenResponse(BaseModel):
    data: RefreshTokenPayload


class GoogleOAuthBody(BaseModel):
    token: str


class OAuthGooglePayload(BaseModel):
    access_token: str
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


class ScannedQRCodeOwnerResponse(BaseModel):
    first_name: str
    last_name: str
    phone_number: Optional[str]
    email: str


class ScannedQRCodeResponse(BaseModel):
    pet: PetSchema
    owners: List[ScannedQRCodeOwnerResponse]
    code: str


class ProfileNotificationsResponse(BaseModel):
    data: List[NotificationWithPetSchema]


class PetByIdResponse(BaseModel):
    data: PetSchema


class PetCodesResponse(BaseModel):
    data: List[CodeSchema]


class PetLocationsResponse(BaseModel):
    data: List[LocationSchema]


class ScanningPetCreateLocationBody(BaseModel):
    qr_code: str
    lng: str
    lat: str


class CreatePetSchema(BaseModel):
    data: PetSchema


class UpdatePetBody(BaseModel):
    extra: Optional[str]
    name: Optional[str]
    specie_id: Optional[int]


class NotificationSuscribeBody(BaseModel):
    token: str
