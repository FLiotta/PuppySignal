from typing import List, Optional
from pydantic import BaseModel

from server.schemas.pet import PetSchema


# Bodies


class DeleteRefreshTokenBody(BaseModel):
    refresh_token: str


class RefreshTokenBody(BaseModel):
    refresh_token: str


class GoogleOAuthBody(BaseModel):
    token: str


class ProfilePatchBody(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    phone_number: Optional[str]


class PhoneNumberBody(BaseModel):
    phone_number: str


class PhoneNumberVerifyBody(BaseModel):
    phone_number: str
    code: int


class ScanningPetCreateLocationBody(BaseModel):
    qr_code: str
    lng: str
    lat: str


class UpdatePetBody(BaseModel):
    extra: Optional[str]
    name: Optional[str]
    specie_id: Optional[int]


class NotificationSuscribeBody(BaseModel):
    token: str


# Responses


class RefreshTokenResponse(BaseModel):
    access_token: str


class OAuthGoogleResponse(BaseModel):
    access_token: str
    refresh_token: str


class ProfilePetsResponse(BaseModel):
    data: List[PetSchema]
    total: int


class ScannedQRCodeOwnerResponse(BaseModel):
    first_name: str
    last_name: str
    phone_number: Optional[str]
    email: str


class ScannedQRCodeResponse(BaseModel):
    pet: PetSchema
    owners: Optional[List[ScannedQRCodeOwnerResponse]]
    code: str
